import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import './style/sos.scss';
import PrimaryLayout from './pages/layout/PrimaryLayout';
import DashboardPage from './pages/dasboard/DashboardPage';
import CustomerMasterPage from './pages/masters/CustomerMasterPage';
import { CUSTOMER_MASTER_ROUTE } from './constants';

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
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
