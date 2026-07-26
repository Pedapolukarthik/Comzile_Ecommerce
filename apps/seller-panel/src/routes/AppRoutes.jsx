import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';
import Layout from '../components/Layout';

import SellerLogin from '../pages/SellerLogin';
import SellerRegistration from '../pages/SellerRegistration';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import StoreSettings from '../pages/StoreSettings';
import Categories from '../pages/Categories';
import Products from '../pages/Products';
import ProductForm from '../pages/ProductForm';
import ProductImages from '../pages/ProductImages';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<SellerLogin />} />
        <Route path="/register" element={<SellerRegistration />} />
      </Route>

      {/* Protected Seller Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/products/:id/edit" element={<ProductForm />} />
          <Route path="/products/images" element={<ProductImages />} />
          <Route path="/products/:id/images" element={<ProductImages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<StoreSettings />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
