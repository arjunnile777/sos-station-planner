export type ClientAllType = {
  page?: number;
  page_size?: number;
  station_name?: string;
};

export type CreateClientType = {
  barcode: string;
  customer_id?: string | number;
  part_no: string | number;
  order_no: string;
};

export type DeleteClientType = {
  id: number;
  markDelete: number;
};
