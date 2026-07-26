import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sellerApi } from '../api/sellerApi';
import { ArrowLeft, Package, Save, Loader2, AlertCircle } from 'lucide-react';

export const ProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    categoryId: '',
    brand: '',
    regularPrice: '',
    salePrice: '',
    stockQuantity: 0,
    lowStockThreshold: 5,
    weight: '',
    dimensions: '',
    shortDescription: '',
    description: '',
    status: 'ACTIVE',
    featured: false,
  });

  const [error, setError] = useState('');

  // Fetch Categories for dropdown
  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => sellerApi.getCategories('ACTIVE'),
  });
  const categories = catData?.data || [];

  // If edit mode, fetch existing product details
  const { data: productData, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => sellerApi.getProductById(id),
    enabled: isEdit,
  });

  useEffect(() => {
    if (isEdit && productData?.data) {
      const p = productData.data;
      setFormData({
        name: p.name || '',
        sku: p.sku || '',
        categoryId: p.categoryId || '',
        brand: p.brand || '',
        regularPrice: p.regularPrice || '',
        salePrice: p.salePrice || '',
        stockQuantity: p.stockQuantity ?? 0,
        lowStockThreshold: p.lowStockThreshold ?? 5,
        weight: p.weight || '',
        dimensions: p.dimensions || '',
        shortDescription: p.shortDescription || '',
        description: p.description || '',
        status: p.status || 'ACTIVE',
        featured: Boolean(p.featured),
      });
    }
  }, [isEdit, productData]);

  const saveMutation = useMutation({
    mutationFn: (data) => (isEdit ? sellerApi.updateProduct(id, data) : sellerApi.createProduct(data)),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      navigate('/products');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to save product details');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Frontend validation
    if (Number(formData.regularPrice) <= 0) {
      setError('Regular price must be greater than 0');
      return;
    }
    if (formData.salePrice && Number(formData.salePrice) > Number(formData.regularPrice)) {
      setError('Sale price cannot exceed regular price');
      return;
    }

    saveMutation.mutate({
      ...formData,
      regularPrice: Number(formData.regularPrice),
      salePrice: formData.salePrice ? Number(formData.salePrice) : null,
      stockQuantity: Number(formData.stockQuantity),
      lowStockThreshold: Number(formData.lowStockThreshold),
      weight: formData.weight ? Number(formData.weight) : null,
    });
  };

  if (isEdit && isLoadingProduct) {
    return <div className="p-8 text-center text-slate-500 text-sm">Loading product details...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link to="/products" className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
        <span className="text-xs text-slate-500 font-mono">{isEdit ? `ID: ${id}` : 'New Product Entry'}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="p-3 bg-emerald-600/10 border border-emerald-500/20 rounded-2xl">
          <Package className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Product' : 'Create New Product'}</h1>
          <p className="text-sm text-slate-400 mt-0.5">Fill in product information, pricing, stock and specs</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-800/50 rounded-xl flex items-center gap-3 text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">General Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ergonomic Office Chair"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                SKU (Stock Keeping Unit) *
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                placeholder="e.g. FUR-CHAIR-001"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Brand Name
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. ComfortTech"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Product Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="DRAFT">DRAFT</option>
                <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Pricing & Stock Inventory</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Regular Price (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                min={0.01}
                value={formData.regularPrice}
                onChange={(e) => setFormData({ ...formData, regularPrice: e.target.value })}
                placeholder="1999.00"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Sale Price (₹)
              </label>
              <input
                type="number"
                step="0.01"
                min={0}
                value={formData.salePrice}
                onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                placeholder="1499.00"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                min={0}
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                placeholder="50"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Low Stock Threshold
              </label>
              <input
                type="number"
                min={0}
                value={formData.lowStockThreshold}
                onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                placeholder="5"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min={0}
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="1.5"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Dimensions (L x W x H)
              </label>
              <input
                type="text"
                value={formData.dimensions}
                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                placeholder="e.g. 50x50x90 cm"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 text-sm text-slate-200 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-950 border-slate-800"
              />
              Mark as Featured Product (Highlight on Store Front)
            </label>
          </div>
        </div>

        {/* Descriptions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Product Descriptions</h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Short Summary
            </label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="Brief 1-sentence product summary"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed product features, specifications, and warranty information..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            to="/products"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition-colors"
          >
            {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEdit ? 'Update Product' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
