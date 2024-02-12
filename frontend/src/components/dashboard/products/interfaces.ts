export interface Product {
  productId: string;
  name: string;
  category: {
    name: string;
  };
  description: string;
  rating: number;
  price: number;
  parsedSpecifications: string;
  quantity: number;
  discount: number;
  brand: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

export interface Category {
  name: string;
  categoryId: number;
}

export interface Brand {
  name: string;
  brandId: number;
}

export interface FilterString {
  brand: string;
  category: string;
  archived: string;
}

export interface Data {
  brands: Brand[];
  categories: Category[];
  products: Product[];
}
