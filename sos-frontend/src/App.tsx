import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import './style/sos.scss';
import PrimaryLayout from './pages/layout/PrimaryLayout';
import DashboardPage from './pages/dasboard/DashboardPage';
import CustomerMasterPage from './pages/masters/CustomerMasterPage';
import {
  CLIENT_ROUTE,
  CUSTOMER_MASTER_ROUTE,
  CUSTOMER_PART_LINKAGE_ROUTE,
  EMPLOYEE_MASTER_ROUTE,
  PART_MASTER_ROUTE,
  PLANNING_ROUTE,
  REPORTS_ROUTE,
  STATION_MASTER_ROUTE,
} from './constants';
import PartMasterPage from './pages/masters/PartMasterPage';
import StationMasterPage from './pages/masters/StationMasterPage';
import CustomerPartLinkagePage from './pages/masters/CustomerPartLinkagePage';
import EmployeeMasterPage from './pages/masters/EmployeeMasterPage';
import PlanningPage from './pages/planning/PlanningPage';
import ClientPage from './pages/client/ClientPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<PrimaryLayout />} path="/">
          <Route path="" element={<DashboardPage />} />
          <Route
            path={CUSTOMER_MASTER_ROUTE}
            element={<CustomerMasterPage />}
          />
          <Route path={PART_MASTER_ROUTE} element={<PartMasterPage />} />
          <Route
            path={CUSTOMER_PART_LINKAGE_ROUTE}
            element={<CustomerPartLinkagePage />}
          />
          <Route path={STATION_MASTER_ROUTE} element={<StationMasterPage />} />
          <Route
            path={EMPLOYEE_MASTER_ROUTE}
            element={<EmployeeMasterPage />}
          />
          <Route path={PLANNING_ROUTE} element={<PlanningPage />} />
          <Route path={CLIENT_ROUTE} element={<ClientPage />} />
          <Route path={REPORTS_ROUTE} element={<CustomerMasterPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
