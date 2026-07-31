const DRAFT_KEY = "create-product-draft";
const IMAGE_DB = "create-product-draft-db";
const IMAGE_STORE = "images";

export type ProductDraftFields = {
  name?: string;
  description?: string;
  brand?: string;
  productNumber?: string;
  modelNumber?: string;
  sizes?: string[];
  gender?: "men" | "women" | "kids";
  basePrice?: number;
  stock?: number;
  discount?: number;
  discountType?: "percentage" | "fixed_amount";
  discountStartDate?: string | null;
  discountEndDate?: string | null;
  storeLocation?: string;
  category?: string;
  subCategory?: string;
  cost_price?: number;
};

type StoredImage = {
  name: string;
  type: string;
  lastModified: number;
  dataUrl: string;
};

function openImageDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(IMAGE_DB, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(IMAGE_STORE)) {
        db.createObjectStore(IMAGE_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function dataUrlToFile(stored: StoredImage): File {
  const [header, base64] = stored.dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] || stored.type || "image/jpeg";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  const mimeToExt: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  const hasExt = /\.[a-z0-9]+$/i.test(stored.name || "");
  const ext = mimeToExt[mime] || "jpg";
  const safeName = hasExt
    ? stored.name
    : `${(stored.name || "image").replace(/\.[a-z0-9]+$/i, "") || "image"}.${ext}`;

  return new File([bytes], safeName, {
    type: mime,
    lastModified: stored.lastModified,
  });
}

export function saveDraftFields(fields: ProductDraftFields) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(fields));
  } catch (err) {
    console.error("Failed to save product draft fields:", err);
  }
}

export function loadDraftFields(): ProductDraftFields | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ProductDraftFields;
  } catch {
    return null;
  }
}

export function clearDraftFields() {
  localStorage.removeItem(DRAFT_KEY);
}

export async function saveDraftImages(files: File[]) {
  try {
    const stored: StoredImage[] = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        type: file.type,
        lastModified: file.lastModified,
        dataUrl: await fileToDataUrl(file),
      }))
    );
    const db = await openImageDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(IMAGE_STORE, "readwrite");
      tx.objectStore(IMAGE_STORE).put(stored, "files");
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch (err) {
    console.error("Failed to save product draft images:", err);
  }
}

export async function loadDraftImages(): Promise<File[]> {
  try {
    const db = await openImageDb();
    const stored = await new Promise<StoredImage[] | undefined>((resolve, reject) => {
      const tx = db.transaction(IMAGE_STORE, "readonly");
      const request = tx.objectStore(IMAGE_STORE).get("files");
      request.onsuccess = () => resolve(request.result as StoredImage[] | undefined);
      request.onerror = () => reject(request.error);
    });
    db.close();
    if (!stored?.length) return [];
    return stored.map(dataUrlToFile);
  } catch {
    return [];
  }
}

export async function clearDraftImages() {
  try {
    const db = await openImageDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(IMAGE_STORE, "readwrite");
      tx.objectStore(IMAGE_STORE).delete("files");
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch (err) {
    console.error("Failed to clear product draft images:", err);
  }
}

export async function clearProductDraft() {
  clearDraftFields();
  await clearDraftImages();
}
