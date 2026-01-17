"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

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
      // Fetch trending (highest rated with most reviews)
      const trendingResponse = await fetch("/api/products?sort=most_reviewed");
      const trendingData = await trendingResponse.json();
      setTrending(trendingData.products.slice(0, 8));

      // Fetch recently reviewed
      const recentResponse = await fetch("/api/products?sort=newest");
      const recentData = await recentResponse.json();
      setRecent(recentData.products.slice(0, 8));
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="text-5xl font-bold mb-4">ClothesReview</h1>
          <p className="text-2xl mb-8">Yelp for Clothes - Find your perfect fit</p>
          <p className="text-lg mb-8 max-w-2xl">
            Discover honest reviews from real people about the clothes you&apos;re considering.
            Share your experiences and help others find their perfect outfit.
          </p>
          <div className="flex space-x-4">
            <Link
              href="/products"
              className="px-6 py-3 bg-white text-blue-600 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Products
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-3 border-2 border-white text-white rounded-md font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Trending Products */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Trending Products</h2>
            <Link
              href="/products?sort=most_reviewed"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : trending.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-600">No products yet. Be the first to add one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trending.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="relative h-48 bg-gray-200">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 text-sm text-gray-700">
                          {product.avgRating.toFixed(1)}
                        </span>
                        <span className="ml-1 text-sm text-gray-500">
                          ({product.totalReviews})
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {product.priceRange}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Recently Reviewed */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Recently Reviewed</h2>
            <Link
              href="/products?sort=newest"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : recent.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-600">No products yet. Be the first to add one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recent.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="relative h-48 bg-gray-200">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 text-sm text-gray-700">
                          {product.avgRating.toFixed(1)}
                        </span>
                        <span className="ml-1 text-sm text-gray-500">
                          ({product.totalReviews})
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {product.priceRange}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Honest Reviews</h3>
            <p className="text-gray-600">
              Read detailed reviews from real people with measurements and fit information.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Find Your Fit</h3>
            <p className="text-gray-600">
              Filter reviews by size and body type to find people with similar measurements.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Where to Buy</h3>
            <p className="text-gray-600">
              Compare prices across retailers and find the best deals on your favorite items.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
