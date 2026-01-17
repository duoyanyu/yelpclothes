"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

interface Review {
  id: string;
  rating: number;
  fitRating: number;
  comfort: number;
  value: number;
  durability: number;
  title?: string;
  content: string;
  sizePurchased: string;
  usualSize: string;
  fitDescription: string;
  heightCm?: number;
  weightKg?: number;
  bodyType?: string;
  photos: string[];
  helpfulCount: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image?: string;
    helpfulVotes: number;
  };
  upvotes: Array<{ userId: string }>;
}

interface RetailerLink {
  id: string;
  retailerName: string;
  url: string;
  price?: number;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  priceRange: string;
  description?: string;
  images: string[];
  avgRating: number;
  avgFitRating: number;
  avgComfort: number;
  avgValue: number;
  avgDurability: number;
  totalReviews: number;
  reviews: Review[];
  retailerLinks: RetailerLink[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ size: "", bodyType: "" });

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      const data = await response.json();
      setProduct(data.product);
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (reviewId: string) => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    try {
      await fetch(`/api/reviews/${reviewId}/upvote`, {
        method: "POST",
      });
      fetchProduct(); // Refresh to get updated counts
    } catch (error) {
      console.error("Failed to upvote:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Product not found</p>
      </div>
    );
  }

  const filteredReviews = product.reviews.filter((review) => {
    if (filter.size && review.sizePurchased !== filter.size) return false;
    if (filter.bodyType && review.bodyType !== filter.bodyType) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
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

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-xl text-gray-600 mb-4">{product.brand}</p>
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  <span className="text-3xl text-yellow-500">★</span>
                  <span className="ml-2 text-2xl font-semibold text-gray-900">
                    {product.avgRating.toFixed(1)}
                  </span>
                </div>
                <span className="ml-3 text-gray-600">
                  ({product.totalReviews} reviews)
                </span>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center">
                  <span className="w-24 text-sm text-gray-600">Fit:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(product.avgFitRating / 5) * 100}%` }}
                    />
                  </div>
                  <span className="ml-2 text-sm text-gray-900">
                    {product.avgFitRating.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-24 text-sm text-gray-600">Comfort:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(product.avgComfort / 5) * 100}%` }}
                    />
                  </div>
                  <span className="ml-2 text-sm text-gray-900">
                    {product.avgComfort.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-24 text-sm text-gray-600">Value:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(product.avgValue / 5) * 100}%` }}
                    />
                  </div>
                  <span className="ml-2 text-sm text-gray-900">
                    {product.avgValue.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-24 text-sm text-gray-600">Durability:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(product.avgDurability / 5) * 100}%` }}
                    />
                  </div>
                  <span className="ml-2 text-sm text-gray-900">
                    {product.avgDurability.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm mr-2">
                  {product.category}
                </span>
                <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {product.priceRange}
                </span>
              </div>

              {product.description && (
                <p className="text-gray-700 mb-6">{product.description}</p>
              )}

              <Link
                href={`/products/${product.id}/review`}
                className="inline-block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                Write a Review
              </Link>
            </div>
          </div>
        </div>

        {/* Where to Buy */}
        {product.retailerLinks && product.retailerLinks.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Where to Buy</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.retailerLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-gray-300 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <div className="font-semibold text-gray-900 mb-2">
                    {link.retailerName}
                  </div>
                  {link.price && (
                    <div className="text-lg font-bold text-blue-600">
                      ${link.price.toFixed(2)}
                    </div>
                  )}
                  <div className="text-sm text-blue-600 mt-2">Buy Now →</div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Reviews ({product.totalReviews})
          </h2>

          {/* Review Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <select
              value={filter.size}
              onChange={(e) => setFilter({ ...filter, size: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sizes</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
            <select
              value={filter.bodyType}
              onChange={(e) => setFilter({ ...filter, bodyType: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Body Types</option>
              <option value="slim">Slim</option>
              <option value="athletic">Athletic</option>
              <option value="average">Average</option>
              <option value="curvy">Curvy</option>
              <option value="plus">Plus</option>
            </select>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {filteredReviews.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No reviews yet. Be the first to review this product!
              </p>
            ) : (
              filteredReviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3" />
                      <div>
                        <p className="font-semibold text-gray-900">{review.user.name}</p>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="text-yellow-500">★</span>
                          <span className="ml-1">{review.rating.toFixed(1)}</span>
                          <span className="ml-2">•</span>
                          <span className="ml-2">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUpvote(review.id)}
                      className="flex items-center px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <span className="text-sm">👍 Helpful ({review.helpfulCount})</span>
                    </button>
                  </div>

                  {review.title && (
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {review.title}
                    </h3>
                  )}

                  <p className="text-gray-700 mb-4">{review.content}</p>

                  {/* Review photos */}
                  {review.photos && review.photos.length > 0 && (
                    <div className="flex gap-2 mb-4 overflow-x-auto">
                      {review.photos.map((photo, idx) => (
                        <div key={idx} className="relative w-32 h-32 flex-shrink-0">
                          <Image
                            src={photo}
                            alt={`Review photo ${idx + 1}`}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Fit information */}
                  <div className="bg-gray-50 rounded-md p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Size purchased:</span>
                        <span className="ml-2 font-semibold">{review.sizePurchased}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Usual size:</span>
                        <span className="ml-2 font-semibold">{review.usualSize}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Fit:</span>
                        <span className="ml-2 font-semibold">
                          {review.fitDescription.replace(/_/g, " ")}
                        </span>
                      </div>
                      {review.bodyType && (
                        <div>
                          <span className="text-gray-600">Body type:</span>
                          <span className="ml-2 font-semibold capitalize">
                            {review.bodyType}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
