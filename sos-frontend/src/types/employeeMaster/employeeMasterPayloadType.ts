export type EmployeeMastersAllType = {
  page?: number;
  page_size?: number;
  name: string;
  eid: string;
  role: number;
};

export type CreateEmployeeMasterType = {
  id?: number;
  name: string;
  role: string;
  username: string;
  password: string;
  status: number;
  eid: string;
};

export type DeleteEmployeeMasterType = {
  id: number;
  markDelete: number;
};
