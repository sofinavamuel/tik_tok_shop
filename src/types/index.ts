export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}

export interface Product {
  id: string;
  category_id?: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  images: string[];
  material?: string;
  origin?: string;
  featured: boolean;
  in_stock: boolean;
  created_at?: string;
  stripe_price_id?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
