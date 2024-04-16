import { Category, Pageable, Sort, Status } from "@/lib/interfaces";

export interface Banner {
  bannerId: string;
  name: string;
  category: Category;
  status: Status;
  link: string;
  position: "homepage" | "category";
  includeButton: boolean;
  aspectRatio: "horizontal" | "vertical";
  activationTime: string;
  expirationTime: string;
}

export interface Page {
  content: Banner;
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
