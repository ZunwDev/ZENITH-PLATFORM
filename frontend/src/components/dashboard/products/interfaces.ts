interface Product {
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

export interface Checked {
  brands: number[];
  categories: number[];
  archived: number[];
}

export const initialCheckedState: Checked = {
  archived: [],
  categories: [],
  brands: [],
};

export const initialFilterString: FilterString = {
  brand: "",
  category: "",
  archived: "",
};

interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

interface Pageable {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  sort: Sort;
  unpaged: boolean;
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
