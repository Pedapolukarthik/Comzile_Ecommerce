import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { sellerApi } from '../api/sellerApi';
import { Link } from 'react-router-dom';
import { Package, FolderTree, Image as ImageIcon, CheckCircle, Store, ArrowRight, Layers } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();

  const { data: prodData } = useQuery({
    queryKey: ['products-dashboard'],
    queryFn: () => sellerApi.getProducts({ limit: 100 }),
  });

  const { data: catData } = useQuery({
    queryKey: ['categories-dashboard'],
    queryFn: () => sellerApi.getCategories(),
  });

  const products = prodData?.data || [];
  const categories = catData?.data || [];

  const outOfStockCount = products.filter((p) => p.stockQuantity === 0 || p.status === 'OUT_OF_STOCK').length;
  const activeProductsCount = products.filter((p) => p.status === 'ACTIVE').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Merchant Overview</h1>
        <p className="text-sm text-slate-400 mt-1">Welcome back, {user?.firstName || user?.ownerName || 'Merchant'}! Manage your multi-tenant store catalog.</p>
      </div>

      {/* Account Status Card */}
      <div className="p-6 bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-800/50 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase text-emerald-400 tracking-wider block">Account Status</span>
            <h3 className="text-lg font-bold text-white">Store Active & Approved</h3>
            <p className="text-xs text-slate-300 mt-0.5">Store ID: <code className="font-mono text-emerald-300">{user?.storeId}</code> | Store Name: <strong className="text-white">{user?.storeName}</strong></p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-400" /> ACTIVE
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Products</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">{products.length}</span>
            <Link to="/products" className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
              View <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Products</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-white">{activeProductsCount}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Categories</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <FolderTree className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">{categories.length}</span>
            <Link to="/categories" className="text-xs text-amber-400 hover:underline flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Out of Stock</span>
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-white">{outOfStockCount}</span>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Catalog Management Shortcuts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/products/new"
            className="p-5 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-2xl group transition-all"
          >
            <div className="p-3 bg-emerald-600/10 text-emerald-400 rounded-xl w-fit mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">Create Product</h3>
            <p className="text-xs text-slate-400 mt-1">Add new products with SKU, pricing, stock and specs.</p>
          </Link>

          <Link
            to="/categories"
            className="p-5 bg-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-2xl group transition-all"
          >
            <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-xl w-fit mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <FolderTree className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">Categories</h3>
            <p className="text-xs text-slate-400 mt-1">Organize your products into active store categories.</p>
          </Link>

          <Link
            to="/products/images"
            className="p-5 bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-2xl group transition-all"
          >
            <div className="p-3 bg-amber-600/10 text-amber-400 rounded-xl w-fit mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">Product Images</h3>
            <p className="text-xs text-slate-400 mt-1">Upload gallery pictures and manage primary product covers.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
