"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import StarRating from "@/components/StarRating";

interface StarInputProps {
  label: string;
  description?: string;
  value: number;
  onChange: (value: number) => void;
}

const StarInput = ({ label, description, value, onChange }: StarInputProps) => {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="pb-4 border-b border-[#e6e6e6] last:border-b-0">
      <div className="flex items-center justify-between mb-2">
        <div>
          <label className="block text-base font-bold text-[#2b2b2b]">{label}</label>
          {description && <p className="text-sm text-[#666666] mt-1">{description}</p>}
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverValue(star)}
              onMouseLeave={() => setHoverValue(0)}
              onClick={() => onChange(star)}
              className="transition-transform hover:scale-110 focus:outline-none"
            >
              <svg
                className={`w-10 h-10 ${
                  star <= (hoverValue || value)
                    ? "text-[#ffa500] fill-current"
                    : "text-[#e6e6e6] fill-current"
                }`}
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

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
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="spinner-large"></div>
      </div>
    );
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

  const charCount = formData.content.length;
  const charCountColor =
    charCount < 50
      ? "text-[#d32323]"
      : charCount < 100
      ? "text-[#ffa500]"
      : "text-[#00a562]";

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm animate-fade-in">
          <Link href="/" className="text-[#666666] hover:text-[#d32323] transition-colors">
            Home
          </Link>
          <span className="text-[#cccccc]">/</span>
          <Link href="/products" className="text-[#666666] hover:text-[#d32323] transition-colors">
            Products
          </Link>
          {product && (
            <>
              <span className="text-[#cccccc]">/</span>
              <Link
                href={`/products/${params.id}`}
                className="text-[#666666] hover:text-[#d32323] transition-colors"
              >
                {product.name}
              </Link>
            </>
          )}
          <span className="text-[#cccccc]">/</span>
          <span className="text-[#2b2b2b] font-medium">Write Review</span>
        </div>

        {/* Header */}
        <div className="mb-8 animate-scale-in">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-8 h-8 text-[#d32323]"
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
            <h1 className="text-4xl font-bold text-[#2b2b2b]">Write a Review</h1>
          </div>
          {product && (
            <div className="flex items-center gap-3 ml-10">
              <span className="text-sm font-bold text-[#999999] uppercase tracking-wider">
                {product.brand}
              </span>
              <span className="text-[#cccccc]">•</span>
              <p className="text-lg text-[#666666]">{product.name}</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 animate-scale-in">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
          {/* Ratings Section */}
          <div className="card p-8">
            <div className="flex items-center gap-2 mb-6">
              <svg
                className="w-6 h-6 text-[#ffa500]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <h2 className="text-2xl font-bold text-[#2b2b2b]">Rate This Product</h2>
            </div>
            <p className="text-[#666666] mb-6">
              Click the stars to rate each aspect (1 = poor, 5 = excellent)
            </p>
            <div className="space-y-6">
              <StarInput
                label="Overall Rating"
                description="Your overall experience with this product"
                value={formData.rating}
                onChange={(value) => setFormData({ ...formData, rating: value })}
              />
              <StarInput
                label="Fit Accuracy"
                description="How well does the sizing match what you expected?"
                value={formData.fitRating}
                onChange={(value) => setFormData({ ...formData, fitRating: value })}
              />
              <StarInput
                label="Comfort"
                description="How comfortable is this product to wear?"
                value={formData.comfort}
                onChange={(value) => setFormData({ ...formData, comfort: value })}
              />
              <StarInput
                label="Value for Money"
                description="Is it worth the price?"
                value={formData.value}
                onChange={(value) => setFormData({ ...formData, value: value })}
              />
              <StarInput
                label="Durability"
                description="How well does it hold up over time?"
                value={formData.durability}
                onChange={(value) => setFormData({ ...formData, durability: value })}
              />
            </div>
          </div>

          {/* Fit Information Section */}
          <div className="card p-8">
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
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
              <h2 className="text-2xl font-bold text-[#2b2b2b]">Fit Information</h2>
            </div>
            <p className="text-[#666666] mb-6">
              Help others find their perfect size by sharing fit details
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#2b2b2b] mb-2">
                  Size You Purchased <span className="text-[#d32323]">*</span>
                </label>
                <select
                  required
                  value={formData.sizePurchased}
                  onChange={(e) =>
                    setFormData({ ...formData, sizePurchased: e.target.value })
                  }
                  className="input"
                >
                  <option value="">Select size</option>
                  <option value="XS">XS - Extra Small</option>
                  <option value="S">S - Small</option>
                  <option value="M">M - Medium</option>
                  <option value="L">L - Large</option>
                  <option value="XL">XL - Extra Large</option>
                  <option value="XXL">XXL - 2X Large</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#2b2b2b] mb-2">
                  Your Usual Size <span className="text-[#d32323]">*</span>
                </label>
                <select
                  required
                  value={formData.usualSize}
                  onChange={(e) =>
                    setFormData({ ...formData, usualSize: e.target.value })
                  }
                  className="input"
                >
                  <option value="">Select size</option>
                  <option value="XS">XS - Extra Small</option>
                  <option value="S">S - Small</option>
                  <option value="M">M - Medium</option>
                  <option value="L">L - Large</option>
                  <option value="XL">XL - Extra Large</option>
                  <option value="XXL">XXL - 2X Large</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-bold text-[#2b2b2b] mb-2">
                How Does It Fit? <span className="text-[#d32323]">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: "runs_small", label: "Runs Small", emoji: "📉", color: "blue" },
                  { value: "true_to_size", label: "True to Size", emoji: "✅", color: "green" },
                  { value: "runs_large", label: "Runs Large", emoji: "📈", color: "orange" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, fitDescription: option.value })
                    }
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      formData.fitDescription === option.value
                        ? option.color === "blue"
                          ? "border-blue-500 bg-blue-50"
                          : option.color === "green"
                          ? "border-green-500 bg-green-50"
                          : "border-orange-500 bg-orange-50"
                        : "border-[#e6e6e6] hover:border-[#cccccc]"
                    }`}
                  >
                    <div className="text-3xl mb-2">{option.emoji}</div>
                    <div className="font-bold text-[#2b2b2b]">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Written Review Section */}
          <div className="card p-8">
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
              <h2 className="text-2xl font-bold text-[#2b2b2b]">Your Review</h2>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-[#2b2b2b] mb-2">
                Review Title <span className="text-[#666666] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input"
                placeholder="Sum up your experience in one line"
                maxLength={100}
              />
              <p className="mt-1 text-xs text-[#666666]">
                e.g., "Perfect fit and great quality!" or "Runs smaller than expected"
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#2b2b2b] mb-2">
                Detailed Review <span className="text-[#d32323]">*</span>
              </label>
              <textarea
                required
                rows={8}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="input"
                placeholder="Share your experience... What did you like? How did it fit? How's the quality? Would you recommend it?"
              />
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm text-[#666666]">
                  Minimum 50 characters for a helpful review
                </p>
                <p className={`text-sm font-bold ${charCountColor}`}>
                  {charCount} characters
                </p>
              </div>
            </div>
          </div>

          {/* Photos Section */}
          <div className="card p-8">
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-[#2b2b2b]">Add Photos</h2>
              <span className="text-sm font-medium text-[#666666]">(Optional)</span>
            </div>
            <p className="text-[#666666] mb-6">
              Help others by sharing photos of the product. Reviews with photos are more helpful!
            </p>
            <div className="space-y-4">
              {formData.photoUrls.map((url, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-[#666666] mb-2">
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
                    className="input"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-[#f9f9f9] rounded-lg">
              <p className="text-sm text-[#666666]">
                💡 <strong>Tip:</strong> Upload your photos to an image hosting service like Imgur,
                then paste the URL here
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary px-8 py-3 text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8 py-3 text-base flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Submitting...
                </>
              ) : (
                <>
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Submit Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
