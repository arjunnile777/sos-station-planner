export type PlanningAllType = {
  page?: number;
  page_size?: number;
  station_name?: string;
};

export type CreatePlanningType = {
  id?: number;
  customer_name: string;
  customer_id: string;
  part_no: string;
  part_id: string;
  scanned_quantity: string;
  total_quantity: string;
  status: string;
};

export type DeletePlanningType = {
  id: number;
  markDelete: number;
};

export type PlanningByOrderNoType = {
  order_number: string;
};
