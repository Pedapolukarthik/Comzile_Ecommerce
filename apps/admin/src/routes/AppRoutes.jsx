import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';
import Layout from '../components/Layout';

import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import SellerManagement from '../pages/SellerManagement';
import PendingSellers from '../pages/PendingSellers';
import ApprovedSellers from '../pages/ApprovedSellers';
import RejectedSellers from '../pages/RejectedSellers';
import SellerDetails from '../pages/SellerDetails';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sellers" element={<SellerManagement />} />
          <Route path="/sellers/pending" element={<PendingSellers />} />
          <Route path="/sellers/approved" element={<ApprovedSellers />} />
          <Route path="/sellers/rejected" element={<RejectedSellers />} />
          <Route path="/sellers/:id" element={<SellerDetails />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
