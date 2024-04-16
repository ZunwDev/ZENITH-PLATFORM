export interface SessionData {
  userId: string;
  roleId: string;
  firstName: string;
  isAdmin: boolean;
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
  brand?: number[];
  category?: number[];
  status?: number[];
}

export const initialCheckedState: Checked = {
  status: [],
  category: [],
  brand: [],
};

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  sort: Sort;
  unpaged: boolean;
}

export interface AmountData {
  type: {
    id: {
      amount: number;
      name: string;
    };
  };
}
