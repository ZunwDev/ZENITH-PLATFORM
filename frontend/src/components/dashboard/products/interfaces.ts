import { Brand, Category, Pageable, Sort, Status } from "@/lib/interfaces";

export interface Product {
  productId: string;
  name: string;
  category: Category;
  status: Status;
  description: string;
  price: number;
  quantity: number;
  discount: number;
  brand: Brand;
  createdAt: string;
  updatedAt: string;
}

export interface Page {
  content: Product;
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: Pageable;
  size: number;
  sort: Sort;
  totalElements: number;
  totalPages: number;
}

export interface FilterData {
  categories?: Category[];
  brands?: Brand[];
  status?: Status[];
  productTypes?: string[];
}
