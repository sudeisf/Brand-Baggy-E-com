export interface OrderItem {
      id: number;
      product_name: string;
      product_id: string;
      price: string;
      subtotal: string;
      quantity: number;
      main_image: string;
      description: string;
      size: string
    }
    
    export interface OrderDetailResponse {
      id: number;
      status : string;
      order_date : string;
      items: OrderItem[];
    }
    