export type CustomerMastersAllType = {
  page?: number;
  page_size?: number;
  name?: string;
  phone?: string;
  contact_person?: string;
};

export type CreateCustomerMasterType = {
  id?: number;
  name: string;
  code: string;
  contact_person: string;
  phone: number | string;
  status: number;
  address: string;
};

export type DeleteCustomerMasterType = {
  id: number;
  markDelete: number;
};
