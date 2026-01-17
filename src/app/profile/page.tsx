"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-gray-300 rounded-full mr-6" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="text-sm text-gray-600">
                    <span className="font-semibold">{user.reviews.length}</span> Reviews
                  </span>
                  <span className="text-sm text-gray-600">
                    <span className="font-semibold">{user.followers.length}</span> Followers
                  </span>
                  <span className="text-sm text-gray-600">
                    <span className="font-semibold">{user.following.length}</span> Following
                  </span>
                  <span className="text-sm text-gray-600">
                    <span className="font-semibold">{user.helpfulVotes}</span> Helpful Votes
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Measurements */}
          {(user.heightCm || user.weightKg || user.bodyType) && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Measurements</h2>
              <div className="flex flex-wrap gap-4">
                {user.heightCm && (
                  <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    Height: {user.heightCm} cm
                  </span>
                )}
                {user.weightKg && (
                  <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    Weight: {user.weightKg} kg
                  </span>
                )}
                {user.bodyType && (
                  <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm capitalize">
                    Body Type: {user.bodyType}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Reviews</h2>
          {user.reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">You haven&apos;t written any reviews yet.</p>
              <Link
                href="/products"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Browse products to review
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {user.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <Link
                    href={`/products/${review.product.id}`}
                    className="flex items-start space-x-4 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
                      {review.product.images && review.product.images.length > 0 ? (
                        <Image
                          src={review.product.images[0]}
                          alt={review.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {review.product.brand} - {review.product.name}
                      </h3>
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 text-sm text-gray-700">
                          {review.rating.toFixed(1)}
                        </span>
                        <span className="ml-3 text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-700 line-clamp-2">{review.content}</p>
                      <p className="mt-2 text-sm text-gray-500">
                        👍 {review.helpfulCount} people found this helpful
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
