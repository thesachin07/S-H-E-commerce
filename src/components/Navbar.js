"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/context/CartContext";

const Navbar = () => {
  const { cartCount } = useCart();
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  // State toggle for mobile menu
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select(`
          id,
          name,
          subcategories ( id, name )
        `)
        .limit(4);

      if (error) console.error(error);
      else setCategories(data || []);
    };
    fetchCategories();
  }, []);

  return (
    <nav className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      {/* ********** NAV CONTAINER ********** */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* ===== LEFT ===== */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-red-600">
            H&S
          </Link>

          {/* Desktop Categories */}
          <ul className="hidden md:flex gap-6 text-sm font-medium">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="relative"
                onMouseEnter={() => setActiveCategory(cat.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link
                  href={`/shop/${cat.id}`}
                  className="hover:underline"
                >
                  {cat.name.toUpperCase()}
                </Link>

                {/* Subcategories Dropdown */}
                {activeCategory === cat.id && (
                  <div className="absolute top-full left-0 mt-1 w-40 bg-white border shadow-lg rounded-md">
                    {cat.subcategories?.length > 0 ? (
                      cat.subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/shop/${sub.id}`}
                          className="block px-3 py-2 text-sm hover:bg-gray-100 "
                        >
                          {sub.name}
                        </Link>
                      ))
                    ) : (
                      <p className="px-3 py-2 text-sm text-gray-500">
                        No subcategories
                      </p>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* ===== RIGHT ===== */}
        <div className="flex items-center gap-5 text-black">

          {/* Search Icon */}
          <Link href="/search" aria-label="Search" className="hover:text-gray-600">
            <svg role="img" aria-hidden="true" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" height="16" width="16">
      <path fillRule="evenodd" d="M9.823 10.883a5.5 5.5 0 1 1 1.06-1.06l4.72 4.72-1.06 1.06-4.72-4.72ZM10.5 6.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"></path>
    </svg>
          </Link>

          {/* Profile Icon */}
          <Link href="/profile" aria-label="Profile" className="hover:text-gray-600">
            <svg role="img" aria-hidden="true" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" height="16" width="16">
      <path fillRule="evenodd" d="M12 4a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-1.5 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z M8 9.5c-1.888 0-3.826.201-5.319.855-.755.33-1.43.793-1.918 1.435C.268 12.444 0 13.24 0 14.17V16h1.5v-1.83c0-.626.174-1.098.458-1.473.292-.384.732-.708 1.325-.968C4.487 11.202 6.174 11 8 11c1.833 0 3.518.182 4.721.7.591.254 1.03.574 1.319.96.283.375.46.859.46 1.511V16H16v-1.829c0-.948-.265-1.755-.761-2.414-.49-.65-1.168-1.11-1.925-1.436C11.82 9.678 9.88 9.5 8 9.5Z"></path>
    </svg>
          </Link>

          {/* Favorites Icon */}
          <Link href="/favorites" aria-label="Favorites" className="hover:text-gray-600">
            <svg role="img" aria-hidden="true" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" height="16" width="16">
      <path d="M8.697 2.253a4.278 4.278 0 0 1 6.05 6.05L8 15.05 1.253 8.304a4.278 4.278 0 0 1 6.05-6.05L8 2.948l.696-.696Zm4.99 1.06a2.778 2.778 0 0 0-3.93 0L8.003 5.07 6.243 3.315a2.779 2.779 0 0 0-3.93 3.928L8 12.928l5.686-5.686a2.778 2.778 0 0 0 0-3.928Z"></path>
    </svg>
          </Link>

          {/* Cart Icon */}
          <Link href="/cart" aria-label="Cart" className="hover:text-gray-600 relative">
            <svg role="img" aria-hidden="true" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" height="16" width="16">
    <path fillRule="evenodd" d="M8 0C6.928 0 5.92.298 5.16.75c-.704.42-1.411 1.115-1.411 2V4.5L0 4.501V15h16V4.5h-3.75V2.75c0-.893-.7-1.59-1.41-2.01C10.08.29 9.072 0 8 0Zm2.75 6v3h1.5V6h2.25v7.5h-13V6h2.25v3h1.5V6h5.5Zm0-1.5V2.75c0-.08-.107-.383-.674-.72C9.557 1.724 8.816 1.5 8 1.5c-.808 0-1.55.228-2.07.539-.577.343-.68.648-.68.711V4.5h5.5Z"></path>
  </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Hamburger for Mobile */}
          <button
            className="md:hidden text-2xl ml-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>

      </div>

      {/* ********** MOBILE MENU ********** */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-4 bg-white border-t border-gray-200">
          {/* Mobile Categories List */}
          <ul className="flex flex-col gap-2 text-sm font-medium">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/shop/${cat.id}`}
                  className="block px-2 py-2 hover:bg-gray-100 rounded"
                >
                  {cat.name.toUpperCase()}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
