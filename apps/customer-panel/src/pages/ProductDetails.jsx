import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { customerApi } from '../api/customerApi';
import {
  ArrowLeft,
  Package,
  Star,
  CheckCircle2,
  AlertCircle,
  Truck,
  ShieldCheck,
  Tag,
  Loader2,
} from 'lucide-react';

export const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const activeStoreId = user?.storeId || 'demo-store-id';

  const [selectedImage, setSelectedImage] = useState(null);

  const { data: productData, isLoading } = useQuery({
    queryKey: ['store-product-details', activeStoreId, id],
    queryFn: () => customerApi.getProductById(activeStoreId, id),
  });

  const product = productData?.data;
  const images = product?.images || [];
  const activeImage = selectedImage || images.find((i) => i.isPrimary)?.imageUrl || images[0]?.imageUrl;

  const isOutOfStock = product?.stockQuantity === 0 || product?.status === 'OUT_OF_STOCK';

  const discountPercent = product?.salePrice && Number(product.regularPrice) > 0
    ? Math.round(((Number(product.regularPrice) - Number(product.salePrice)) / Number(product.regularPrice)) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="p-16 text-center text-slate-500 text-sm flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-400" /> Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center text-slate-400 space-y-4 max-w-lg mx-auto my-12">
        <Package className="w-12 h-12 text-slate-600 mx-auto" />
        <h2 className="text-xl font-bold text-white">Product Not Found</h2>
        <p className="text-sm text-slate-400">The product you are looking for does not exist or is no longer listed.</p>
        <Link to="/catalog" className="inline-block px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl">
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link to="/catalog" className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Storefront Catalog
        </Link>
        <span className="text-xs text-emerald-400 font-mono">SKU: {product.sku}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
            {activeImage ? (
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <Package className="w-16 h-16 text-slate-700" />
            )}

            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-rose-600 text-white text-xs font-extrabold rounded-lg shadow-md uppercase tracking-wider">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.imageUrl)}
                  className={`aspect-square rounded-xl overflow-hidden border bg-slate-950 transition-all ${
                    activeImage === img.imageUrl ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img src={img.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Pricing */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            {product.category && (
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
                {product.category.name}
              </span>
            )}

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">{product.name}</h1>

            {product.brand && <p className="text-sm text-slate-400 font-medium">Brand: <span className="text-slate-200 font-semibold">{product.brand}</span></p>}

            {/* Price Box */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-baseline gap-4">
              {product.salePrice ? (
                <>
                  <span className="text-3xl font-black text-white">₹{Number(product.salePrice).toLocaleString()}</span>
                  <span className="text-base text-slate-500 line-through">₹{Number(product.regularPrice).toLocaleString()}</span>
                  <span className="text-xs text-rose-400 font-bold bg-rose-950/60 border border-rose-800/50 px-2.5 py-1 rounded-lg">
                    Save ₹{(Number(product.regularPrice) - Number(product.salePrice)).toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-black text-white">₹{Number(product.regularPrice).toLocaleString()}</span>
              )}
            </div>

            {/* Stock Availability Pill */}
            <div>
              <span
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold ${
                  isOutOfStock
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                    : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                }`}
              >
                {isOutOfStock ? <AlertCircle className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {isOutOfStock ? 'Currently Out of Stock' : `In Stock (${product.stockQuantity} available)`}
              </span>
            </div>

            {/* Descriptions */}
            {product.shortDescription && (
              <p className="text-sm text-slate-300 leading-relaxed font-medium">{product.shortDescription}</p>
            )}

            {product.description && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Product Overview</h3>
                <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">{product.description}</p>
              </div>
            )}
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-500 block font-medium">SKU</span>
              <span className="text-slate-200 font-mono font-semibold">{product.sku}</span>
            </div>
            {product.weight && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-slate-500 block font-medium">Weight</span>
                <span className="text-slate-200 font-mono font-semibold">{product.weight} kg</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
