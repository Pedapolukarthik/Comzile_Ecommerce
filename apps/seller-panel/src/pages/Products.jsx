import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { sellerApi } from '../api/sellerApi';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Layers,
} from 'lucide-react';

export const Products = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [quickStockModal, setQuickStockModal] = useState(null);
  const [newStock, setNewStock] = useState(0);

  const [toast, setToast] = useState({ type: '', message: '' });

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: '', message: '' }), 4000);
  };

  // Fetch Categories for Filter Dropdown
  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => sellerApi.getCategories('ACTIVE'),
  });
  const categories = catData?.data || [];

  // Fetch Products
  const { data: prodData, isLoading } = useQuery({
    queryKey: ['products', search, categoryId, status, page],
    queryFn: () => sellerApi.getProducts({ search, categoryId, status, page, limit: 10 }),
  });

  const products = prodData?.data || [];
  const meta = prodData?.meta || { totalPages: 1, page: 1, total: 0 };

  const deleteMutation = useMutation({
    mutationFn: (id) => sellerApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      showToast('success', 'Product deleted successfully');
    },
    onError: (err) => {
      showToast('error', err.response?.data?.message || 'Failed to delete product');
    },
  });

  const stockMutation = useMutation({
    mutationFn: ({ id, stockQuantity }) => sellerApi.updateStock(id, stockQuantity),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      showToast('success', 'Stock updated successfully');
      setQuickStockModal(null);
    },
    onError: (err) => {
      showToast('error', err.response?.data?.message || 'Failed to update stock');
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-400" /> Products
          </h1>
          <p className="text-sm text-slate-400 mt-1">Manage product listings, pricing, stock and gallery images</p>
        </div>

        <Link
          to="/products/new"
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-emerald-600/20"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {toast.message && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-3 ${
            toast.type === 'success'
              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
              : 'bg-rose-950/60 text-rose-300 border border-rose-800/50'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search SKU, name, brand..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(1);
            }}
            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="DRAFT">DRAFT</option>
            <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 text-sm flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">No products found matching filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs font-semibold uppercase text-slate-400 bg-slate-950/50 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Product Details</th>
                  <th className="py-3.5 px-4">SKU & Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {products.map((prod) => {
                  const primaryImg = prod.images?.find((i) => i.isPrimary)?.imageUrl || prod.images?.[0]?.imageUrl;
                  return (
                    <tr key={prod.id} className="hover:bg-slate-800/30">
                      <td className="py-4 px-4 font-medium text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {primaryImg ? (
                              <img src={primaryImg} alt={prod.name} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-5 h-5 text-slate-600" />
                            )}
                          </div>
                          <div>
                            <span className="text-white block font-semibold hover:text-emerald-400 transition-colors">
                              {prod.name}
                            </span>
                            {prod.brand && <span className="text-xs text-slate-500 block font-normal">{prod.brand}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-xs font-mono text-slate-300 block">{prod.sku}</span>
                        <span className="text-xs text-emerald-400 block">{prod.category?.name || 'Uncategorized'}</span>
                      </td>
                      <td className="py-4 px-4 font-mono text-sm">
                        {prod.salePrice ? (
                          <div>
                            <span className="text-emerald-400 font-bold">₹{Number(prod.salePrice).toLocaleString()}</span>
                            <span className="text-xs text-slate-500 line-through block font-normal">₹{Number(prod.regularPrice).toLocaleString()}</span>
                          </div>
                        ) : (
                          <span className="text-slate-200">₹{Number(prod.regularPrice).toLocaleString()}</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => {
                            setQuickStockModal(prod);
                            setNewStock(prod.stockQuantity);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 border transition-colors ${
                            prod.stockQuantity === 0
                              ? 'bg-rose-950/80 text-rose-300 border-rose-800/60'
                              : prod.stockQuantity <= prod.lowStockThreshold
                              ? 'bg-amber-950/80 text-amber-300 border-amber-800/60'
                              : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                          }`}
                          title="Click to update stock"
                        >
                          <Layers className="w-3 h-3" /> {prod.stockQuantity} in stock
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            prod.status === 'ACTIVE'
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                              : prod.status === 'OUT_OF_STOCK'
                              ? 'bg-rose-950/80 text-rose-300 border-rose-800/60'
                              : 'bg-amber-950/80 text-amber-300 border-amber-800/60'
                          }`}
                        >
                          {prod.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/products/${prod.id}/images`}
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                            title="Manage Images"
                          >
                            <ImageIcon className="w-4 h-4 text-indigo-400" />
                          </Link>
                          <Link
                            to={`/products/${prod.id}/edit`}
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4 text-emerald-400" />
                          </Link>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete product '${prod.name}'?`)) {
                                deleteMutation.mutate(prod.id);
                              }
                            }}
                            className="p-2 bg-slate-800 hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="p-4 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Page {meta.page} of {meta.totalPages} ({meta.total} products)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg disabled:opacity-50 font-medium"
              >
                Previous
              </button>
              <button
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg disabled:opacity-50 font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stock Modal */}
      {quickStockModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Update Stock Quantity</h3>
            <p className="text-xs text-slate-400">
              Product: <span className="text-emerald-400 font-semibold">{quickStockModal.name}</span>
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                New Stock Quantity
              </label>
              <input
                type="number"
                min={0}
                value={newStock}
                onChange={(e) => setNewStock(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => setQuickStockModal(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-sm font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => stockMutation.mutate({ id: quickStockModal.id, stockQuantity: newStock })}
                disabled={stockMutation.isPending}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl flex items-center gap-2 disabled:opacity-50"
              >
                {stockMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Stock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
