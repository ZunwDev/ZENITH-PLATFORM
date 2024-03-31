export interface Product {
  productId: string;
  name: string;
  category: Category;
  status: Status;
  description: string;
  rating: number;
  price: number;
  parsedSpecifications: string;
  quantity: number;
  discount: number;
  brand: Brand;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  name: string;
  categoryId: number;
  amount: number;
}

export interface Status {
  name: string;
  statusId: number;
  amount: number;
}

export interface Brand {
  name: string;
  brandId: number;
  amount: number;
}

export interface Checked {
  brand: number[];
  category: number[];
  status: number[];
}

export const initialCheckedState: Checked = {
  status: [],
  category: [],
  brand: [],
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

export interface AmountData {
  type: {
    id: {
      amount: number;
      name: string;
    };
  };
}

export interface FilterData {
  categories: Category[];
  brands: Brand[];
  productTypes: string[];
}
