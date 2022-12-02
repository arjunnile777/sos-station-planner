export type ClientAllType = {
  page?: number;
  page_size?: number;
  station_name?: string;
};

export type CreateClientType = {
  id?: number;
  station_name: string;
  status: number;
};

export type DeleteClientType = {
  id: number;
  markDelete: number;
};
