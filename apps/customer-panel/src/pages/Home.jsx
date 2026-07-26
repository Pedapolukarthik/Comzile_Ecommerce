import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { customerApi } from '../api/customerApi';
import ProductCard from '../components/ProductCard';
import { ShoppingBag, ArrowRight, Sparkles, FolderTree, Package, ShieldCheck } from 'lucide-react';

export const Home = () => {
  const { user } = useAuth();
  const activeStoreId = user?.storeId || 'demo-store-id';

  // Fetch Categories
  const { data: catData } = useQuery({
    queryKey: ['store-categories', activeStoreId],
    queryFn: () => customerApi.getCategories(activeStoreId),
  });
  const categories = catData?.data || [];

  // Fetch Featured Products
  const { data: featuredData, isLoading: isLoadingFeatured } = useQuery({
    queryKey: ['featured-products', activeStoreId],
    queryFn: () => customerApi.getProducts(activeStoreId, { featured: 'true', limit: 8 }),
  });
  const featuredProducts = featuredData?.data || [];

  // Fetch All Products
  const { data: allProdsData, isLoading: isLoadingAll } = useQuery({
    queryKey: ['all-products-home', activeStoreId],
    queryFn: () => customerApi.getProducts(activeStoreId, { limit: 8 }),
  });
  const allProducts = allProdsData?.data || [];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-800/40 p-8 sm:p-12 shadow-2xl">
        <div className="max-w-2xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Multi-Tenant Storefront Active
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Discover Premium Products for Your Lifestyle
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Browse through our curated collection of verified products, transparent pricing, and instant delivery.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/catalog"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/25"
            >
              Explore Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Category Pills Slider */}
      {categories.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-emerald-400" /> Shop by Category
            </h2>
            <Link to="/catalog" className="text-xs text-emerald-400 font-semibold hover:underline">
              View All &rarr;
            </Link>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/catalog?category=${cat.id}`}
                className="px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-xs font-semibold text-slate-200 hover:text-emerald-400 transition-all shrink-0 flex items-center gap-2"
              >
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-4 h-4 rounded-full object-cover" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                )}
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" /> Featured Collection
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Top-rated items handpicked for you</p>
            </div>
            <Link to="/catalog?featured=true" className="text-xs text-emerald-400 font-semibold hover:underline">
              Browse Collection &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} storeId={activeStoreId} />
            ))}
          </div>
        </section>
      )}

      {/* All Catalog Products */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-400" /> Store Catalog
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Explore all available products</p>
          </div>
          <Link to="/catalog" className="text-xs text-emerald-400 font-semibold hover:underline">
            Open Full Catalog &rarr;
          </Link>
        </div>

        {isLoadingAll ? (
          <div className="p-12 text-center text-slate-500 text-sm">Loading products...</div>
        ) : allProducts.length === 0 ? (
          <div className="p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center text-slate-400">
            No products available in this store yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allProducts.map((p) => (
              <ProductCard key={p.id} product={p} storeId={activeStoreId} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
