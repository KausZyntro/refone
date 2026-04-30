export interface ProductTest {
  id: number;
  brand_id: number;
  name: string;
  screen_size: string;
  battery_capacity: string;
  front_camera: string;
  back_camera: string;
  network_support: string;
  sim_slots: string;
  fingerprint_scanner: number;
  face_unlock: number;
  status: string;
  created_at: string;
  brand: {
    id: number;
    name: string;
  };
  variants: VariantTest[];
}

export interface VariantTest {
  id: number;
  product_id: number;
  storage: string;
  color: string;
  color_code: string;
  grade: string;
  weight: string;
  sku: string;
  pricing: {
    id: number;
    variant_id: number;
    mrp: string;
    selling_price: string;
  };
  inventory: {
    id: number;
    variant_id: number;
    total_stock: number;
    inbound_stock?: number;
    is_active?: number;
  };
  images: ProductImage[];
  product_warranty: any[];
}

export interface ProductImage {
  id: number;
  variant_id: number;
  image_url: string;
  thumbnail_url: string;
}

export interface RelatedProductTest {
  id: number;
  title: string;
  subtitle: string;
  price: number;
  image: string;
}
