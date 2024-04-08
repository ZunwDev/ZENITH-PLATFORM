export type Attribute = {
  attributeId: number;
  attributeTypeId: number;
  categoryId: number;
  name: string;
};

export type AttributeType = {
  attributeTypeId: number;
  name: string;
};

export type FormData = {
  categoryId?: number;
  name: string;
};
