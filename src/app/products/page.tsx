"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import StarRating from "@/components/StarRating";

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  priceRange: string;
  avgRating: number;
  totalReviews: number;
  images: string[];
}

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-[#e6e6e6] h-64 rounded-t-lg"></div>
    <div className="p-4 space-y-3">
      <div className="h-6 bg-[#e6e6e6] rounded w-3/4"></div>
      <div className="h-4 bg-[#e6e6e6] rounded w-1/2"></div>
      <div className="h-4 bg-[#e6e6e6] rounded w-2/3"></div>
    </div>
  </div>
);

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minRating, setMinRating] = useState("");
  const [photosOnly, setPhotosOnly] = useState(false);
  const [sort, setSort] = useState("newest");

  const fetchProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    if (minRating) params.append("minRating", minRating);
    if (photosOnly) params.append("photosOnly", "true");
    if (sort) params.append("sort", sort);

    const response = await fetch(`/api/products?${params}`);
    const data = await response.json();
    setProducts(data.products || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category, minRating, photosOnly, sort]);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "tops":
        return "👕";
      case "bottoms":
        return "👖";
      case "dresses":
        return "👗";
      case "outerwear":
        return "🧥";
      case "shoes":
        return "👟";
      case "accessories":
        return "👜";
      default:
        return "🏷️";
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-[#2b2b2b] mb-2">All Products</h1>
          <p className="text-[#666666]">
            Browse {products.length > 0 ? products.length : ""} clothing items with real reviews
          </p>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8 animate-scale-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products, brands..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input"
            >
              <option value="">All Categories</option>
              <option value="tops">👕 Tops</option>
              <option value="bottoms">👖 Bottoms</option>
              <option value="dresses">👗 Dresses</option>
              <option value="outerwear">🧥 Outerwear</option>
              <option value="shoes">👟 Shoes</option>
              <option value="accessories">👜 Accessories</option>
            </select>

            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="input"
            >
              <option value="">All Ratings</option>
              <option value="4">⭐ 4+ Stars</option>
              <option value="3">⭐ 3+ Stars</option>
              <option value="2">⭐ 2+ Stars</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input"
            >
              <option value="newest">🆕 Newest</option>
              <option value="highest_rated">⭐ Highest Rated</option>
              <option value="most_reviewed">💬 Most Reviewed</option>
            </select>

            <label className="flex items-center space-x-2 cursor-pointer px-4 py-2 rounded-lg border-2 border-[#e6e6e6] hover:border-[#d32323] transition-colors">
              <input
                type="checkbox"
                checked={photosOnly}
                onChange={(e) => setPhotosOnly(e.target.checked)}
                className="w-4 h-4 text-[#d32323] border-[#cccccc] rounded focus:ring-[#d32323] focus:ring-2"
              />
              <svg
                className="w-5 h-5 text-[#666666]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm font-medium text-[#2b2b2b]">Photos only</span>
            </label>
          </div>

          {/* Active Filters */}
          {(search || category || minRating || photosOnly) && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-[#e6e6e6]">
              <span className="text-sm text-[#666666] font-semibold">Active filters:</span>
              {search && (
                <span className="px-3 py-1 bg-[#d32323] text-white rounded-full text-sm font-medium flex items-center gap-1">
                  Search: {search}
                  <button
                    onClick={() => setSearch("")}
                    className="ml-1 hover:opacity-80"
                  >
                    ×
                  </button>
                </span>
              )}
              {category && (
                <span className="px-3 py-1 bg-[#d32323] text-white rounded-full text-sm font-medium flex items-center gap-1">
                  {getCategoryIcon(category)} {category}
                  <button
                    onClick={() => setCategory("")}
                    className="ml-1 hover:opacity-80"
                  >
                    ×
                  </button>
                </span>
              )}
              {minRating && (
                <span className="px-3 py-1 bg-[#d32323] text-white rounded-full text-sm font-medium flex items-center gap-1">
                  {minRating}+ Stars
                  <button
                    onClick={() => setMinRating("")}
                    className="ml-1 hover:opacity-80"
                  >
                    ×
                  </button>
                </span>
              )}
              {photosOnly && (
                <span className="px-3 py-1 bg-[#d32323] text-white rounded-full text-sm font-medium flex items-center gap-1">
                  Photos only
                  <button
                    onClick={() => setPhotosOnly(false)}
                    className="ml-1 hover:opacity-80"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("");
                  setMinRating("");
                  setPhotosOnly(false);
                }}
                className="px-3 py-1 text-[#d32323] hover:bg-[#fef3f2] rounded-full text-sm font-semibold transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <LoadingSkeleton />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="card p-12 text-center animate-scale-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#f5f5f5] mb-6">
              <svg
                className="w-10 h-10 text-[#999999]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#2b2b2b] mb-2">No products found</h3>
            <p className="text-[#666666] mb-6">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("");
                setMinRating("");
                setPhotosOnly(false);
              }}
              className="btn-secondary"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="card-hover overflow-hidden group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative h-64 bg-[#f5f5f5] overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-[#999999]">
                      <svg
                        className="w-16 h-16"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                  {/* Price badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
                    <span className="text-sm font-bold text-[#2b2b2b]">
                      {product.priceRange}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-1">
                    <span className="text-xs font-semibold text-[#999999] uppercase tracking-wider">
                      {product.brand}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-[#2b2b2b] mb-2 line-clamp-2 group-hover:text-[#d32323] transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StarRating rating={product.avgRating} size="sm" showNumber />
                      <span className="text-sm text-[#666666]">
                        ({product.totalReviews})
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
