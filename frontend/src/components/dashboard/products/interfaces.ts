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
  amount: number;
}

export interface Archived {
  name: string;
  archivedyId: number;
  amount: number;
}

export interface Brand {
  name: string;
  brandId: number;
  amount: number;
}

export interface FilterString {
  brand: string;
  category: string;
  archived: string;
}

export interface Checked {
  brand: number[];
  category: number[];
  archived: number[];
}

export const initialCheckedState: Checked = {
  archived: [],
  category: [],
  brand: [],
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

export interface AmountData {
  type: {
    id: {
      amount: number;
      name: string;
    };
  };
}
