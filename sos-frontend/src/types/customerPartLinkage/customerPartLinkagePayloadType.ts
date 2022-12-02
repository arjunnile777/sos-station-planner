export type CustomerPartLinkageAllType = {
  page?: number;
  page_size?: number;
  name?: string;
  phone?: string;
  contact_person?: string;
};

export type CreateCustomerPartLinkageType = {
  id?: number;
  customer_name: string;
  customer_id: string;
  part_no: string;
  part_id: string;
  status: number;
  barcode: string;
  quantity: string;
  customer_part_no: string;
};

export type DeleteCustomerPartLinkageType = {
  id: number;
  markDelete: number;
};
