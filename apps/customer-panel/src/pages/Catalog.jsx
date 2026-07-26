import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { customerApi } from '../api/customerApi';
import ProductCard from '../components/ProductCard';
import { Search, Filter, SlidersHorizontal, Loader2, Package } from 'lucide-react';

export const Catalog = () => {
  const { user } = useAuth();
  const activeStoreId = user?.storeId || 'demo-store-id';
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);

  // Fetch Categories
  const { data: catData } = useQuery({
    queryKey: ['store-categories', activeStoreId],
    queryFn: () => customerApi.getCategories(activeStoreId),
  });
  const categories = catData?.data || [];

  // Fetch Products
  const { data: prodData, isLoading } = useQuery({
    queryKey: ['store-products', activeStoreId, search, categoryId, minPrice, maxPrice, sortBy, sortOrder, page],
    queryFn: () =>
      customerApi.getProducts(activeStoreId, {
        search,
        categoryId,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder,
        page,
        limit: 12,
      }),
  });

  const products = prodData?.data || [];
  const meta = prodData?.meta || { totalPages: 1, page: 1, total: 0 };

  return (
    <div className="space-y-8 pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          <Package className="w-7 h-7 text-emerald-400" /> Storefront Catalog
        </h1>
        <p className="text-sm text-slate-400 mt-1">Browse, filter, and discover products available in this store</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 h-fit">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" /> Catalog Filters
            </h2>
            {(search || categoryId || minPrice || maxPrice) && (
              <button
                onClick={() => {
                  setSearch('');
                  setCategoryId('');
                  setMinPrice('');
                  setMaxPrice('');
                  setSearchParams({});
                }}
                className="text-xs text-rose-400 font-semibold hover:underline"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Product name, brand..."
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Category</label>
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setPage(1);
              }}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Price Range (₹)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Sort By</label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                setSortBy(sb);
                setSortOrder(so);
              }}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="createdAt-desc">Newest Additions</option>
              <option value="regularPrice-asc">Price: Low to High</option>
              <option value="regularPrice-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3 space-y-6">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500 text-sm flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> Loading catalog...
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center text-slate-400 space-y-2">
              <Package className="w-10 h-10 text-slate-600 mx-auto" />
              <p>No products found matching the selected filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} storeId={activeStoreId} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between text-xs text-slate-400">
              <span>
                Page {meta.page} of {meta.totalPages} ({meta.total} items)
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg disabled:opacity-50 font-medium"
                >
                  Previous
                </button>
                <button
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg disabled:opacity-50 font-medium"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Catalog;
