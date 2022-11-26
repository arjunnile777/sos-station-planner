export type PartMastersAllType = {
  page?: number;
  page_size?: number;
  name?: string;
  phone?: string;
  contact_person?: string;
};

export type CreatePartMasterType = {
  id?: number;
  name: string;
  code: string;
  contact_person: string;
  phone: number | string;
  status: number;
  address: string;
};
