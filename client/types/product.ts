// types/product.ts
export interface Size {
      id: number;
      name: string;
      code: string;
      is_favourited: boolean;
    }
    
    export interface Variant {
      id: number;
      stock: number;
      sku: string;
      size: Size;
    }
    
    export interface Category {
      id: number;
      name: string;
      slug: string;
      description: string;
      parent: number;
    }
    
    export interface Seller {
      id: number;
      username: string;
      first_name: string;
      last_name: string;
      email: string;
      phone_number: string;
      gender: string;
      birth_date: string;
      user_role: string;
      profile_url: string;
    }
    
    export interface Review {
      id: number;
      rating: number;
      comment: string;
      name: string;
      date: string;
      avatar: string;
    }
    
    export interface Discount {
      type: string;
      value: string;
      is_active: boolean;
      is_valid : boolean;
      start_date: string;
      end_date: string;
    }
    
    export interface ProductDetail {
      id: number;
      name: string;
      description: string;
      main_image: string;
      brand: string;
      category: Category;
      images: string[];
      reviews: Review[];
      variants: Variant[];
      seller: Seller;
      price: string;
      discount: Discount;
      in_stock: boolean;
      gender: string
    }