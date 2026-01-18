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

export default function Home() {
  const [trending, setTrending] = useState<Product[]>([]);
  const [recent, setRecent] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const trendingResponse = await fetch("/api/products?sort=most_reviewed");
      const trendingData = await trendingResponse.json();
      setTrending(trendingData.products?.slice(0, 8) || []);

      const recentResponse = await fetch("/api/products?sort=newest");
      const recentData = await recentResponse.json();
      setRecent(recentData.products?.slice(0, 8) || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Link
      href={`/products/${product.id}`}
      className="card-hover overflow-hidden group animate-fade-in"
    >
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg
              className="w-16 h-16 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[#2b2b2b] text-base mb-1 line-clamp-1 group-hover:text-[#98EBC5] transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-[#666666] mb-2">{product.brand}</p>
          </div>
          <span className="price-range ml-2 flex-shrink-0">{product.priceRange}</span>
        </div>
        <div className="flex items-center justify-between">
          <StarRating rating={product.avgRating} size="sm" showNumber={false} />
          <span className="text-xs text-[#666666]">
            {product.totalReviews} review{product.totalReviews !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#98EBC5] via-[#7DD4B0] to-[#8b1616] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
              Find Clothes That Actually Fit
            </h1>
            <p className="text-xl md:text-2xl mb-3 text-white/90 font-medium">
              Real reviews from people with real bodies
            </p>
            <p className="text-base md:text-lg mb-10 max-w-2xl mx-auto text-white/80">
              Stop buying clothes that don't fit. Read detailed reviews with measurements,
              photos, and honest opinions from people just like you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="btn-secondary">
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
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
                  Browse Reviews
                </span>
              </Link>
              <Link
                href="/auth/signup"
                className="bg-white text-[#98EBC5] hover:bg-gray-50 font-bold py-3 px-8 rounded-md transition-all duration-200 shadow-lg hover:shadow-xl active:transform active:scale-95"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Quick Links */}
        <div className="mb-12 overflow-x-auto pb-4">
          <div className="flex gap-3 min-w-max">
            {["Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories"].map(
              (category) => (
                <Link
                  key={category}
                  href={`/products?category=${category.toLowerCase()}`}
                  className="px-6 py-2.5 bg-white border-2 border-[#e6e6e6] rounded-full text-sm font-semibold text-[#2b2b2b] hover:border-[#98EBC5] hover:text-[#98EBC5] transition-all duration-200 whitespace-nowrap"
                >
                  {category}
                </Link>
              )
            )}
          </div>
        </div>

        {/* Trending Products */}
        <section className="mb-16 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-heading">Trending Now</h2>
              <p className="text-[#666666] text-sm">
                Most reviewed products this week
              </p>
            </div>
            <Link href="/products?sort=most_reviewed" className="link text-sm font-semibold">
              See all
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : trending.length === 0 ? (
            <div className="text-center py-16 card">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <p className="text-[#666666] mb-4">No products yet</p>
              <Link href="/products/add" className="btn-primary inline-block">
                Be the first to add one!
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trending.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Recently Reviewed */}
        <section className="mb-16 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-heading">Recently Reviewed</h2>
              <p className="text-[#666666] text-sm">Fresh takes from the community</p>
            </div>
            <Link href="/products?sort=newest" className="link text-sm font-semibold">
              See all
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="text-center py-16 card">
              <p className="text-[#666666]">No recent reviews</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recent.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="card p-8 text-center hover:shadow-yelp-md transition-shadow">
            <div className="w-16 h-16 bg-[#98EBC5]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-[#98EBC5]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#2b2b2b] mb-3">Detailed Reviews</h3>
            <p className="text-[#666666]">
              Read reviews with measurements, fit info, and photos from real customers
            </p>
          </div>

          <div className="card p-8 text-center hover:shadow-yelp-md transition-shadow">
            <div className="w-16 h-16 bg-[#0073bb]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-[#0073bb]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#2b2b2b] mb-3">Find Your Fit</h3>
            <p className="text-[#666666]">
              Filter by size, height, and body type to see reviews from people like you
            </p>
          </div>

          <div className="card p-8 text-center hover:shadow-yelp-md transition-shadow">
            <div className="w-16 h-16 bg-[#00a562]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-[#00a562]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#2b2b2b] mb-3">Smart Shopping</h3>
            <p className="text-[#666666]">
              Compare prices across retailers and find the best deals on quality clothes
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
