import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sellerApi } from '../api/sellerApi';
import {
  ArrowLeft,
  Image as ImageIcon,
  Upload,
  Star,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Globe,
  Package,
} from 'lucide-react';

export const ProductImages = () => {
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedProductId, setSelectedProductId] = useState(routeId || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);

  const [toast, setToast] = useState({ type: '', message: '' });

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: '', message: '' }), 4000);
  };

  // Fetch all seller products for selector dropdown
  const { data: allProdsData, isLoading: isLoadingProds } = useQuery({
    queryKey: ['seller-products-list'],
    queryFn: () => sellerApi.getProducts({ limit: 100 }),
  });
  const allProducts = allProdsData?.data || [];

  useEffect(() => {
    if (routeId) {
      setSelectedProductId(routeId);
    } else if (allProducts.length > 0 && !selectedProductId) {
      setSelectedProductId(allProducts[0].id);
    }
  }, [routeId, allProducts, selectedProductId]);

  const activeId = selectedProductId || routeId;

  // Fetch product details for target activeId
  const { data: productData, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', activeId],
    queryFn: () => sellerApi.getProductById(activeId),
    enabled: Boolean(activeId),
  });

  const product = productData?.data;
  const images = product?.images || [];

  const uploadMutation = useMutation({
    mutationFn: (formDataOrData) => sellerApi.uploadProductImage(activeId, formDataOrData),
    onSuccess: () => {
      queryClient.invalidateQueries(['product', activeId]);
      queryClient.invalidateQueries(['products']);
      showToast('success', 'Product image uploaded successfully!');
      setSelectedFile(null);
      setUrlInput('');
      setIsPrimary(false);
    },
    onError: (err) => {
      showToast('error', err.response?.data?.message || 'Failed to upload image');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (imageId) => sellerApi.deleteProductImage(activeId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries(['product', activeId]);
      queryClient.invalidateQueries(['products']);
      showToast('success', 'Image deleted successfully!');
    },
    onError: (err) => {
      showToast('error', err.response?.data?.message || 'Failed to delete image');
    },
  });

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (!activeId) {
      showToast('error', 'Please select a product first');
      return;
    }
    if (!selectedFile && !urlInput.trim()) {
      showToast('error', 'Please choose an image file or enter an image URL');
      return;
    }

    if (selectedFile) {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('isPrimary', isPrimary);
      uploadMutation.mutate(formData);
    } else if (urlInput.trim()) {
      uploadMutation.mutate({ imageUrl: urlInput.trim(), isPrimary });
    }
  };

  const handleProductSelectChange = (e) => {
    const newId = e.target.value;
    setSelectedProductId(newId);
    if (newId) {
      navigate(`/products/${newId}/images`, { replace: true });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link to="/products" className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Products Catalog
        </Link>
        {product && <span className="text-xs text-emerald-400 font-mono">SKU: {product.sku}</span>}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-emerald-400" /> Product Image Gallery
          </h1>
          <p className="text-sm text-slate-400 mt-1">Select a product, upload pictures and set the primary cover image</p>
        </div>

        {/* Product Selector Dropdown */}
        <div className="w-full md:w-72">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Select Product
          </label>
          <select
            value={activeId}
            onChange={handleProductSelectChange}
            disabled={isLoadingProds}
            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
          >
            {allProducts.length === 0 ? (
              <option value="">No products available</option>
            ) : (
              allProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku})
                </option>
              ))
            )}
          </select>
        </div>
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

      {isLoadingProduct ? (
        <div className="p-12 text-center text-slate-500 text-sm flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> Loading images...
        </div>
      ) : !product ? (
        <div className="p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center text-slate-400 space-y-3">
          <Package className="w-10 h-10 text-slate-600 mx-auto" />
          <p>Please select a product from the list above or add a new product first.</p>
          <Link to="/products/new" className="inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl">
            Create Product
          </Link>
        </div>
      ) : (
        <>
          {/* Upload Form Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Upload className="w-4 h-4" /> Upload Image for: {product.name}
            </h2>

            <form onSubmit={handleFileUpload} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Option A: Choose File from Computer
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setSelectedFile(e.target.files[0]);
                      setUrlInput('');
                    }}
                    className="w-full text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-emerald-400 hover:file:bg-slate-700 bg-slate-950 p-1.5 border border-slate-800 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Option B: External Image URL
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => {
                        setUrlInput(e.target.value);
                        setSelectedFile(null);
                      }}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 text-sm text-slate-200 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPrimary}
                    onChange={(e) => setIsPrimary(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-950 border-slate-800"
                  />
                  Set as Primary Cover Image
                </label>

                <button
                  type="submit"
                  disabled={uploadMutation.isPending}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl flex items-center gap-2 disabled:opacity-50 transition-colors shadow-lg shadow-emerald-600/20"
                >
                  {uploadMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Upload Image
                </button>
              </div>
            </form>
          </div>

          {/* Existing Images Gallery */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              Current Image Gallery ({images.length})
            </h2>

            {images.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">No images uploaded for this product yet.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className={`relative group rounded-2xl overflow-hidden border bg-slate-950 ${
                      img.isPrimary ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-800'
                    }`}
                  >
                    <img src={img.imageUrl} alt="Product" className="w-full h-36 object-cover" />

                    {img.isPrimary && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-md flex items-center gap-1 shadow">
                        <Star className="w-3 h-3 fill-current" /> PRIMARY
                      </span>
                    )}

                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                      {!img.isPrimary && (
                        <button
                          onClick={() => uploadMutation.mutate({ imageUrl: img.imageUrl, isPrimary: true })}
                          className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                          title="Set Primary"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this image?')) {
                            deleteMutation.mutate(img.id);
                          }
                        }}
                        className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold"
                        title="Delete Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductImages;
