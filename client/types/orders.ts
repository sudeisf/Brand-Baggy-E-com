export interface OrderItem {
      id: number;
      product_name: string;
      product_id: number;
      price: string;
      subtotal: string;
      quantity: number;
      main_image: string;
      description: string;
    }
    
    export interface ShippingInfo {
      full_name: string;
      address: string;
      city: string;
      state: string;
      zip_code: string;
      country: string;
      phone: string;
      email: string;
      user: number;
    }
    
    export interface Order {
      id: number;
      user: number;
      cart: number;
      total_price: string;
      status: "pending" | "paid" | "cancelled"; 
      order_date: string; 
      shipping_info: ShippingInfo;
      items: OrderItem[];
    }
    

    export type OrderResponse = Order[];
    