import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Home from '../pages/Home';
import Catalog from '../pages/Catalog';
import ProductDetails from '../pages/ProductDetails';
import CustomerLogin from '../pages/CustomerLogin';
import CustomerRegister from '../pages/CustomerRegister';

const StorefrontLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-800 bg-slate-900/60 py-8 text-center text-xs text-slate-500 mt-auto">
        <p>© 2026 Comzilo Multi-Tenant SaaS Platform. All storefront catalog rights reserved.</p>
      </footer>
    </div>
  );
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<StorefrontLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/login" element={<CustomerLogin />} />
        <Route path="/register" element={<CustomerRegister />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
