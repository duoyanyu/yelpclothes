"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import StarRating from "@/components/StarRating";

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

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="card p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#e6e6e6] h-96 rounded-lg"></div>
        <div className="space-y-4">
          <div className="h-8 bg-[#e6e6e6] rounded w-3/4"></div>
          <div className="h-6 bg-[#e6e6e6] rounded w-1/2"></div>
          <div className="h-20 bg-[#e6e6e6] rounded"></div>
          <div className="h-12 bg-[#e6e6e6] rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

const RatingBar = ({ label, rating, icon }: { label: string; rating: number; icon: string }) => (
  <div className="flex items-center gap-3">
    <span className="text-lg">{icon}</span>
    <span className="w-24 text-sm font-medium text-[#666666]">{label}</span>
    <div className="flex-1 bg-[#e6e6e6] rounded-full h-2.5">
      <div
        className="bg-[#98EBC5] h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${(rating / 5) * 100}%` }}
      />
    </div>
    <span className="w-8 text-sm font-bold text-[#2b2b2b]">
      {rating.toFixed(1)}
    </span>
  </div>
);

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ size: "", bodyType: "" });
  const [selectedImage, setSelectedImage] = useState(0);

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
      <div className="min-h-screen bg-[#f5f5f5] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="card p-12 text-center animate-scale-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#E8F9F3] mb-6">
            <svg
              className="w-10 h-10 text-[#98EBC5]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[#2b2b2b] mb-2">Product not found</h3>
          <p className="text-[#666666] mb-6">
            The product you're looking for doesn't exist or has been removed
          </p>
          <Link href="/products" className="btn-primary">
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  const filteredReviews = product.reviews.filter((review) => {
    if (filter.size && review.sizePurchased !== filter.size) return false;
    if (filter.bodyType && review.bodyType !== filter.bodyType) return false;
    return true;
  });

  const getFitBadgeColor = (fit: string) => {
    switch (fit) {
      case "runs_small":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "true_to_size":
        return "bg-green-50 text-green-700 border-green-200";
      case "runs_large":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm animate-fade-in">
          <Link href="/" className="text-[#666666] hover:text-[#98EBC5] transition-colors">
            Home
          </Link>
          <span className="text-[#cccccc]">/</span>
          <Link href="/products" className="text-[#666666] hover:text-[#98EBC5] transition-colors">
            Products
          </Link>
          <span className="text-[#cccccc]">/</span>
          <span className="text-[#2b2b2b] font-medium">{product.name}</span>
        </div>

        {/* Product Header */}
        <div className="card p-8 mb-8 animate-scale-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
              <div className="relative h-96 bg-[#f5f5f5] rounded-lg overflow-hidden mb-4">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-[#999999]">
                    <svg
                      className="w-24 h-24"
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
              </div>
              {/* Image thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                        selectedImage === idx
                          ? "border-[#98EBC5]"
                          : "border-[#e6e6e6] hover:border-[#cccccc]"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-3">
                <span className="text-sm font-bold text-[#999999] uppercase tracking-wider">
                  {product.brand}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-[#2b2b2b] mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <StarRating rating={product.avgRating} size="lg" showNumber />
                  <span className="text-lg text-[#666666]">
                    ({product.totalReviews} {product.totalReviews === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
                <span className="inline-block bg-[#E8F9F3] text-[#98EBC5] px-4 py-1.5 rounded-full text-lg font-bold">
                  {product.priceRange}
                </span>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-3 mb-6 p-6 bg-[#f9f9f9] rounded-lg">
                <h3 className="text-sm font-bold text-[#2b2b2b] uppercase tracking-wider mb-4">
                  Rating Breakdown
                </h3>
                <RatingBar label="Fit" rating={product.avgFitRating} icon="📏" />
                <RatingBar label="Comfort" rating={product.avgComfort} icon="😊" />
                <RatingBar label="Value" rating={product.avgValue} icon="💰" />
                <RatingBar label="Durability" rating={product.avgDurability} icon="💪" />
              </div>

              <div className="mb-6">
                <span className="inline-block bg-[#e6e6e6] text-[#2b2b2b] px-4 py-2 rounded-full text-sm font-semibold capitalize">
                  {product.category}
                </span>
              </div>

              {product.description && (
                <p className="text-[#666666] mb-6 leading-relaxed">{product.description}</p>
              )}

              <Link
                href={`/products/${product.id}/review`}
                className="btn-primary w-full text-center text-lg flex items-center justify-center gap-2"
              >
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Write a Review
              </Link>
            </div>
          </div>
        </div>

        {/* Where to Buy */}
        {product.retailerLinks && product.retailerLinks.length > 0 && (
          <div className="card p-8 mb-8 animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
              <svg
                className="w-6 h-6 text-[#98EBC5]"
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
              <h2 className="text-2xl font-bold text-[#2b2b2b]">Where to Buy</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.retailerLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-[#e6e6e6] rounded-lg p-5 hover:border-[#98EBC5] hover:shadow-lg transition-all group"
                >
                  <div className="font-bold text-lg text-[#2b2b2b] mb-2 group-hover:text-[#98EBC5] transition-colors">
                    {link.retailerName}
                  </div>
                  {link.price && (
                    <div className="text-2xl font-bold text-[#00a562] mb-3">
                      ${link.price.toFixed(2)}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[#98EBC5] font-semibold">
                    <span>Shop Now</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="card p-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <svg
                className="w-6 h-6 text-[#98EBC5]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-[#2b2b2b]">
                Reviews ({product.totalReviews})
              </h2>
            </div>
          </div>

          {/* Review Filters */}
          {product.totalReviews > 0 && (
            <div className="flex flex-wrap gap-4 mb-8 pb-6 border-b border-[#e6e6e6]">
              <select
                value={filter.size}
                onChange={(e) => setFilter({ ...filter, size: e.target.value })}
                className="input"
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
                className="input"
              >
                <option value="">All Body Types</option>
                <option value="slim">Slim</option>
                <option value="athletic">Athletic</option>
                <option value="average">Average</option>
                <option value="curvy">Curvy</option>
                <option value="plus">Plus Size</option>
              </select>
              {(filter.size || filter.bodyType) && (
                <button
                  onClick={() => setFilter({ size: "", bodyType: "" })}
                  className="px-4 py-2 text-[#98EBC5] hover:bg-[#E8F9F3] rounded-md font-semibold transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-8">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-12">
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
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#2b2b2b] mb-2">No reviews yet</h3>
                <p className="text-[#666666] mb-6">
                  Be the first to review this product!
                </p>
                <Link
                  href={`/products/${product.id}/review`}
                  className="btn-primary inline-block"
                >
                  Write the first review
                </Link>
              </div>
            ) : (
              filteredReviews.map((review, index) => {
                const hasUpvoted = review.upvotes.some(
                  (upvote) => upvote.userId === session?.user?.id
                );

                return (
                  <div
                    key={review.id}
                    className="pb-8 border-b border-[#e6e6e6] last:border-b-0 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#98EBC5] rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {review.user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-bold text-[#2b2b2b]">{review.user.name}</p>
                          <div className="flex items-center gap-2 text-sm text-[#666666]">
                            <StarRating rating={review.rating} size="sm" showNumber />
                            <span>•</span>
                            <span>
                              {new Date(review.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUpvote(review.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all ${
                          hasUpvoted
                            ? "bg-[#E8F9F3] text-[#98EBC5] border-2 border-[#98EBC5]"
                            : "border-2 border-[#e6e6e6] text-[#666666] hover:border-[#98EBC5] hover:text-[#98EBC5]"
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill={hasUpvoted ? "currentColor" : "none"}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                          />
                        </svg>
                        <span>{review.helpfulCount}</span>
                      </button>
                    </div>

                    {review.title && (
                      <h3 className="font-bold text-xl text-[#2b2b2b] mb-3">
                        {review.title}
                      </h3>
                    )}

                    <p className="text-[#2b2b2b] leading-relaxed mb-4">{review.content}</p>

                    {/* Review photos */}
                    {review.photos && review.photos.length > 0 && (
                      <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
                        {review.photos.map((photo, idx) => (
                          <div
                            key={idx}
                            className="relative w-40 h-40 flex-shrink-0 rounded-lg overflow-hidden border-2 border-[#e6e6e6] hover:border-[#98EBC5] transition-colors cursor-pointer"
                          >
                            <Image
                              src={photo}
                              alt={`Review photo ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Fit information */}
                    <div className="bg-[#f9f9f9] rounded-lg p-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-[#666666] block mb-1">Size purchased</span>
                          <span className="font-bold text-[#2b2b2b] text-lg">
                            {review.sizePurchased}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#666666] block mb-1">Usual size</span>
                          <span className="font-bold text-[#2b2b2b] text-lg">
                            {review.usualSize}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#666666] block mb-1">Fit</span>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border capitalize ${getFitBadgeColor(
                              review.fitDescription
                            )}`}
                          >
                            {review.fitDescription.replace(/_/g, " ")}
                          </span>
                        </div>
                        {review.bodyType && (
                          <div>
                            <span className="text-[#666666] block mb-1">Body type</span>
                            <span className="font-bold text-[#2b2b2b] text-lg capitalize">
                              {review.bodyType}
                            </span>
                          </div>
                        )}
                      </div>
                      {(review.heightCm || review.weightKg) && (
                        <div className="mt-4 pt-4 border-t border-[#e6e6e6] flex gap-6 text-sm">
                          {review.heightCm && (
                            <div>
                              <span className="text-[#666666]">Height: </span>
                              <span className="font-semibold text-[#2b2b2b]">
                                {review.heightCm}cm
                              </span>
                            </div>
                          )}
                          {review.weightKg && (
                            <div>
                              <span className="text-[#666666]">Weight: </span>
                              <span className="font-semibold text-[#2b2b2b]">
                                {review.weightKg}kg
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
