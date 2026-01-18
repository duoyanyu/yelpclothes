"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import StarRating from "@/components/StarRating";

interface Review {
  id: string;
  rating: number;
  content: string;
  createdAt: string;
  helpfulCount: number;
  product: {
    id: string;
    name: string;
    brand: string;
    images: string[];
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  heightCm?: number;
  weightKg?: number;
  bodyType?: string;
  helpfulVotes: number;
  reviews: Review[];
  followers: Array<{ follower: { id: string; name: string; image?: string } }>;
  following: Array<{ following: { id: string; name: string; image?: string } }>;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchUser();
    }
  }, [status]);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/user");
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="spinner-large"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="card p-12 text-center animate-scale-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#fef3f2] mb-6">
            <svg
              className="w-10 h-10 text-[#d32323]"
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
          <h3 className="text-xl font-bold text-[#2b2b2b] mb-2">User not found</h3>
          <p className="text-[#666666] mb-6">We couldn't load your profile information</p>
          <Link href="/" className="btn-primary">
            Go to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="card p-8 mb-8 animate-scale-in">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-32 h-32 bg-[#d32323] rounded-full flex items-center justify-center text-white text-5xl font-bold flex-shrink-0">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-[#2b2b2b] mb-2">{user.name}</h1>
              <p className="text-[#666666] mb-4">{user.email}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#f9f9f9] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <svg
                      className="w-5 h-5 text-[#d32323]"
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
                    <span className="text-xs font-medium text-[#666666] uppercase tracking-wider">
                      Reviews
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-[#2b2b2b]">
                    {user.reviews.length}
                  </span>
                </div>

                <div className="bg-[#f9f9f9] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <svg
                      className="w-5 h-5 text-[#ffa500]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span className="text-xs font-medium text-[#666666] uppercase tracking-wider">
                      Helpful
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-[#2b2b2b]">
                    {user.helpfulVotes}
                  </span>
                </div>

                <div className="bg-[#f9f9f9] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <svg
                      className="w-5 h-5 text-[#0073bb]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="text-xs font-medium text-[#666666] uppercase tracking-wider">
                      Followers
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-[#2b2b2b]">
                    {user.followers.length}
                  </span>
                </div>

                <div className="bg-[#f9f9f9] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <svg
                      className="w-5 h-5 text-[#00a562]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <span className="text-xs font-medium text-[#666666] uppercase tracking-wider">
                      Following
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-[#2b2b2b]">
                    {user.following.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Measurements */}
          {(user.heightCm || user.weightKg || user.bodyType) && (
            <div className="mt-8 pt-8 border-t border-[#e6e6e6]">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="w-5 h-5 text-[#d32323]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
                <h2 className="text-lg font-bold text-[#2b2b2b]">My Measurements</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {user.heightCm && (
                  <span className="inline-flex items-center gap-2 bg-[#f9f9f9] border border-[#e6e6e6] px-4 py-2 rounded-full text-sm font-medium">
                    <span className="text-[#666666]">Height:</span>
                    <span className="font-bold text-[#2b2b2b]">{user.heightCm} cm</span>
                  </span>
                )}
                {user.weightKg && (
                  <span className="inline-flex items-center gap-2 bg-[#f9f9f9] border border-[#e6e6e6] px-4 py-2 rounded-full text-sm font-medium">
                    <span className="text-[#666666]">Weight:</span>
                    <span className="font-bold text-[#2b2b2b]">{user.weightKg} kg</span>
                  </span>
                )}
                {user.bodyType && (
                  <span className="inline-flex items-center gap-2 bg-[#f9f9f9] border border-[#e6e6e6] px-4 py-2 rounded-full text-sm font-medium capitalize">
                    <span className="text-[#666666]">Body Type:</span>
                    <span className="font-bold text-[#2b2b2b]">{user.bodyType}</span>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="card p-8 animate-fade-in">
          <div className="flex items-center gap-2 mb-6">
            <svg
              className="w-6 h-6 text-[#d32323]"
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
            <h2 className="text-2xl font-bold text-[#2b2b2b]">My Reviews</h2>
            <span className="text-lg text-[#666666]">({user.reviews.length})</span>
          </div>

          {user.reviews.length === 0 ? (
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
                Start reviewing products to share your experiences with the community!
              </p>
              <Link href="/products" className="btn-primary">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {user.reviews.map((review, index) => (
                <Link
                  key={review.id}
                  href={`/products/${review.product.id}`}
                  className="flex items-start gap-4 p-4 rounded-lg border-2 border-[#e6e6e6] hover:border-[#d32323] hover:shadow-md transition-all animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative w-24 h-24 flex-shrink-0 bg-[#f5f5f5] rounded-lg overflow-hidden">
                    {review.product.images && review.product.images.length > 0 ? (
                      <Image
                        src={review.product.images[0]}
                        alt={review.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-[#999999]">
                        <svg
                          className="w-8 h-8"
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
                  <div className="flex-1 min-w-0">
                    <div className="mb-1">
                      <span className="text-xs font-semibold text-[#999999] uppercase tracking-wider">
                        {review.product.brand}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-[#2b2b2b] mb-2 hover:text-[#d32323] transition-colors">
                      {review.product.name}
                    </h3>
                    <div className="flex items-center gap-3 mb-3">
                      <StarRating rating={review.rating} size="sm" showNumber />
                      <span className="text-sm text-[#666666]">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-[#666666] line-clamp-2 mb-3">{review.content}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <svg
                        className="w-4 h-4 text-[#ffa500]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      <span className="font-medium text-[#666666]">
                        {review.helpfulCount} {review.helpfulCount === 1 ? 'person' : 'people'} found this helpful
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
