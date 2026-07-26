import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Tag, Layers, Star } from 'lucide-react';

export const ProductCard = ({ product, storeId = 'demo-store-id' }) => {
  const primaryImg = product.images?.find((i) => i.isPrimary)?.imageUrl || product.images?.[0]?.imageUrl;
  const isOutOfStock = product.stockQuantity === 0 || product.status === 'OUT_OF_STOCK';

  const discountPercent = product.salePrice && Number(product.regularPrice) > 0
    ? Math.round(((Number(product.regularPrice) - Number(product.salePrice)) / Number(product.regularPrice)) * 100)
    : 0;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 flex flex-col shadow-xl"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-slate-950 overflow-hidden flex items-center justify-center">
        {primaryImg ? (
          <img
            src={primaryImg}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-600">
            <Package className="w-10 h-10" />
            <span className="text-[11px]">No Image Available</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {discountPercent > 0 && (
            <span className="px-2.5 py-1 bg-rose-600 text-white text-[10px] font-extrabold rounded-lg shadow-md uppercase tracking-wider">
              {discountPercent}% OFF
            </span>
          )}
          {product.featured && (
            <span className="px-2.5 py-1 bg-amber-500 text-slate-950 text-[10px] font-extrabold rounded-lg shadow-md flex items-center gap-1 uppercase tracking-wider">
              <Star className="w-3 h-3 fill-current" /> FEATURED
            </span>
          )}
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3 py-1.5 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-bold rounded-xl uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {product.category && (
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
              {product.category.name}
            </span>
          )}
          <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
          {product.brand && <p className="text-xs text-slate-400 font-medium">by {product.brand}</p>}
        </div>

        {/* Price & Stock status */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            {product.salePrice ? (
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-extrabold text-white">₹{Number(product.salePrice).toLocaleString()}</span>
                <span className="text-xs text-slate-500 line-through">₹{Number(product.regularPrice).toLocaleString()}</span>
              </div>
            ) : (
              <span className="text-lg font-extrabold text-white">₹{Number(product.regularPrice).toLocaleString()}</span>
            )}
          </div>

          <span
            className={`text-[10px] font-semibold px-2.5 py-1 rounded-md ${
              isOutOfStock
                ? 'bg-rose-950/60 text-rose-400 border border-rose-800/50'
                : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'
            }`}
          >
            {isOutOfStock ? 'Sold Out' : `${product.stockQuantity} in stock`}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
