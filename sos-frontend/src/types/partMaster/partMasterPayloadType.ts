export type PartMastersAllType = {
  page?: number;
  page_size?: number;
  part_no?: string;
};

export type CreatePartMasterType = {
  id?: number;
  part_no: string;
  part_description: string;
  uom: string;
  status: number;
};

export type DeletePartMasterType = {
  id: number;
  markDelete: number;
};
