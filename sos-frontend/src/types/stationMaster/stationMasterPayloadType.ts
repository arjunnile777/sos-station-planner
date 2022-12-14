export type StationMastersAllType = {
  page?: number;
  page_size?: number;
  station_name?: string;
};

export type CreateStationMasterType = {
  id?: number;
  station_name: string;
  status: number;
};

export type DeleteStationMasterType = {
  id: number;
  markDelete: number;
};
