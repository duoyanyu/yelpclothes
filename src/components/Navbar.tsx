"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <nav className="bg-[#98EBC5] border-b border-[#7DD4B0] sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-2xl font-bold text-white hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <svg
                className="w-8 h-8"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-10h2v4h-2v-4zm0 6h2v2h-2v-2z" />
              </svg>
              <span className="hidden sm:inline">FitReview</span>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products, brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 rounded-md border-2 border-white/20 bg-white/10 text-white placeholder-white/70 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:border-white transition-all duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:opacity-80 transition-opacity"
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200"
            >
              Browse
            </Link>

            {session ? (
              <>
                <Link
                  href="/products/add"
                  className="text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 flex items-center gap-1"
                >
                  <svg
                    className="w-4 h-4"
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
                  <span className="hidden sm:inline">Add Product</span>
                </Link>

                <Link
                  href="/profile"
                  className="text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 flex items-center gap-2"
                >
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="hidden lg:inline">{session.user.name}</span>
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-white text-[#98EBC5] hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-bold transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded-md border-2 border-white/20 bg-white/10 text-white placeholder-white/70 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:border-white transition-all duration-200"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white"
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </nav>
  );
}
