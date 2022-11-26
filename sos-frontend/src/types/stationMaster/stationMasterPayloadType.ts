export type StationMastersAllType = {
  page?: number;
  page_size?: number;
  name?: string;
  phone?: string;
  contact_person?: string;
};

export type CreateStationMasterType = {
  id?: number;
  name: string;
  code: string;
  contact_person: string;
  phone: number | string;
  status: number;
  address: string;
};
