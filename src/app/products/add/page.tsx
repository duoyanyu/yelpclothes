"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AddProductPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    priceRange: "",
    description: "",
    imageUrl: "",
  });

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
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          images: formData.imageUrl ? [formData.imageUrl] : [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create product");
        setLoading(false);
        return;
      }

      router.push(`/products/${data.product.id}`);
    } catch (error) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const categories = [
    { value: "tops", label: "Tops", icon: "👕" },
    { value: "bottoms", label: "Bottoms", icon: "👖" },
    { value: "dresses", label: "Dresses", icon: "👗" },
    { value: "outerwear", label: "Outerwear", icon: "🧥" },
    { value: "shoes", label: "Shoes", icon: "👟" },
    { value: "accessories", label: "Accessories", icon: "👜" },
  ];

  const priceRanges = [
    { value: "$", label: "Under $50", description: "Budget-friendly" },
    { value: "$$", label: "$50-$100", description: "Moderate" },
    { value: "$$$", label: "$100-$200", description: "Premium" },
    { value: "$$$$", label: "$200+", description: "Luxury" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <span className="text-[#2b2b2b] font-medium">Add Product</span>
        </div>

        {/* Header */}
        <div className="mb-8 animate-scale-in">
          <div className="flex items-center gap-2 mb-2">
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            <h1 className="text-4xl font-bold text-[#2b2b2b]">Add New Product</h1>
          </div>
          <p className="text-[#666666] ml-10">
            Share a product with the community to start collecting reviews
          </p>
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
          {/* Basic Information */}
          <div className="card p-8">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-[#2b2b2b]">Product Information</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#2b2b2b] mb-2">
                  Product Name <span className="text-[#98EBC5]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="e.g., Classic Fit Cotton T-Shirt"
                />
                <p className="mt-1 text-xs text-[#666666]">
                  Include key details like fit, material, or style
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#2b2b2b] mb-2">
                  Brand <span className="text-[#98EBC5]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="input"
                  placeholder="e.g., Nike, Zara, H&M"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#2b2b2b] mb-2">
                  Description <span className="text-[#666666] font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input"
                  placeholder="Describe the product's features, materials, or what makes it special..."
                />
              </div>
            </div>
          </div>

          {/* Category Selection */}
          <div className="card p-8">
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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-[#2b2b2b]">Category</h2>
              <span className="text-[#98EBC5] text-lg">*</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.value })}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    formData.category === cat.value
                      ? "border-[#98EBC5] bg-[#E8F9F3]"
                      : "border-[#e6e6e6] hover:border-[#cccccc]"
                  }`}
                >
                  <div className="text-4xl mb-2">{cat.icon}</div>
                  <div className="font-bold text-[#2b2b2b]">{cat.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Selection */}
          <div className="card p-8">
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-[#2b2b2b]">Price Range</h2>
              <span className="text-[#98EBC5] text-lg">*</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {priceRanges.map((range) => (
                <button
                  key={range.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, priceRange: range.value })}
                  className={`p-5 rounded-lg border-2 transition-all text-left ${
                    formData.priceRange === range.value
                      ? "border-[#00a562] bg-green-50"
                      : "border-[#e6e6e6] hover:border-[#cccccc]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-[#00a562]">{range.value}</span>
                    <span className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                      {range.description}
                    </span>
                  </div>
                  <div className="font-bold text-[#2b2b2b]">{range.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="card p-8">
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-[#2b2b2b]">Product Image</h2>
              <span className="text-sm font-medium text-[#666666]">(Optional)</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#666666] mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/product-image.jpg"
                className="input"
              />
              <div className="mt-4 p-4 bg-[#f9f9f9] rounded-lg">
                <p className="text-sm text-[#666666]">
                  💡 <strong>Tip:</strong> Upload your image to an image hosting service like Imgur,
                  then paste the URL here. High-quality images help attract more reviews!
                </p>
              </div>
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
                  Creating Product...
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
                  Create Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
