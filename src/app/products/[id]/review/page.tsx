"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function WriteReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [product, setProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    rating: 5,
    fitRating: 5,
    comfort: 5,
    value: 5,
    durability: 5,
    title: "",
    content: "",
    sizePurchased: "",
    usualSize: "",
    fitDescription: "true_to_size",
    photoUrls: ["", "", ""],
  });

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
    }
  };

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.content.length < 50) {
      setError("Review must be at least 50 characters long");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const photos = formData.photoUrls.filter((url) => url.trim() !== "");

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: params.id,
          rating: formData.rating,
          fitRating: formData.fitRating,
          comfort: formData.comfort,
          value: formData.value,
          durability: formData.durability,
          title: formData.title,
          content: formData.content,
          sizePurchased: formData.sizePurchased,
          usualSize: formData.usualSize,
          fitDescription: formData.fitDescription,
          photos,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to submit review");
        setLoading(false);
        return;
      }

      router.push(`/products/${params.id}`);
    } catch (error) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Write a Review</h1>
        {product && (
          <p className="text-gray-600 mb-8">
            {product.brand} - {product.name}
          </p>
        )}

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
          {/* Ratings */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ratings</h2>
            <div className="space-y-4">
              {[
                { key: "rating", label: "Overall Rating" },
                { key: "fitRating", label: "Fit Accuracy" },
                { key: "comfort", label: "Comfort" },
                { key: "value", label: "Value for Money" },
                { key: "durability", label: "Durability" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}: {formData[key as keyof typeof formData]}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={formData[key as keyof typeof formData] as number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [key]: parseInt(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fit Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Fit Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size Purchased *
                </label>
                <select
                  required
                  value={formData.sizePurchased}
                  onChange={(e) =>
                    setFormData({ ...formData, sizePurchased: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select size</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Usual Size *
                </label>
                <select
                  required
                  value={formData.usualSize}
                  onChange={(e) =>
                    setFormData({ ...formData, usualSize: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select size</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                How does it fit? *
              </label>
              <select
                required
                value={formData.fitDescription}
                onChange={(e) =>
                  setFormData({ ...formData, fitDescription: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="runs_small">Runs Small</option>
                <option value="true_to_size">True to Size</option>
                <option value="runs_large">Runs Large</option>
              </select>
            </div>
          </div>

          {/* Written Review */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Review</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Review Title (Optional)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Sum up your experience"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Review * (minimum 50 characters)
              </label>
              <textarea
                required
                rows={6}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Share your experience with this product..."
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.content.length} / 50 characters minimum
              </p>
            </div>
          </div>

          {/* Photos */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Photos (Optional - 3-5 photos)
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Add image URLs to include photos in your review
            </p>
            {formData.photoUrls.map((url, index) => (
              <div key={index} className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo {index + 1} URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => {
                    const newUrls = [...formData.photoUrls];
                    newUrls[index] = e.target.value;
                    setFormData({ ...formData, photoUrls: newUrls });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
