from celery import shared_task
from concurrent.futures import ThreadPoolExecutor, as_completed
import cloudinary.uploader
import os
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def upload_product_images(self, product_id, main_image_path, additional_image_paths):
    """
    Upload product images to Cloudinary in the background.

    Accepts file paths (saved to disk by the serializer) so that the HTTP
    request can return immediately.  Additional images are uploaded in
    parallel via a thread-pool for maximum throughput.
    """
    try:
        from product.models import Product, ProductImage

        product = Product.objects.get(id=product_id)

        # --- main image ---------------------------------------------------
        if main_image_path and os.path.exists(main_image_path):
            result = cloudinary.uploader.upload(main_image_path)
            product.main_image = result['public_id']
            product.save(update_fields=['main_image'])
            os.remove(main_image_path)
            logger.info(
                "Uploaded main image for product %s: %s",
                product_id, result['public_id'],
            )

        # --- additional images (parallel) ---------------------------------
        def _upload_one(path):
            res = cloudinary.uploader.upload(path)
            os.remove(path)
            return res['public_id']

        valid_paths = [p for p in additional_image_paths if os.path.exists(p)]

        with ThreadPoolExecutor(max_workers=4) as pool:
            futures = {pool.submit(_upload_one, p): p for p in valid_paths}
            for future in as_completed(futures):
                path = futures[future]
                try:
                    public_id = future.result()
                    ProductImage.objects.create(
                        product=product, image=public_id,
                    )
                    logger.info(
                        "Uploaded additional image for product %s: %s",
                        product_id, public_id,
                    )
                except Exception as exc:
                    logger.error(
                        "Failed to upload %s for product %s: %s",
                        path, product_id, exc, exc_info=True,
                    )

        # Clean up the temp directory if it's now empty
        if main_image_path:
            temp_dir = os.path.dirname(main_image_path)
        elif valid_paths:
            temp_dir = os.path.dirname(valid_paths[0])
        else:
            temp_dir = None

        if temp_dir and os.path.isdir(temp_dir) and not os.listdir(temp_dir):
            os.rmdir(temp_dir)

        logger.info("All images processed for product %s", product_id)

    except Exception as e:
        logger.error(
            "Failed to upload images for product %s: %s",
            product_id, e, exc_info=True,
        )
        self.retry(exc=e, countdown=60 * (self.request.retries + 1))
