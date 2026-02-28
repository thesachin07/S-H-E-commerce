"use client"
import { supabase } from '@/lib/supabaseClient';
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const SubcategoryDisplay = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get category ID from URL params
  const params = useParams();
  const categoryId = params.id; // Assuming your route is [id]

  useEffect(() => {
    if (categoryId) {
      fetchSubcategories();
    }
  }, [categoryId]);

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("subcategories")
        .select("*")
        .eq('category_id', categoryId); // Filter by category_id

      if (error) throw error;

      setSubcategories(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubcategoryClick = (subcategoryId) => {
    window.location.href = `/shop/${subcategoryId}`; // Relative URL better hai
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading subcategories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Error Loading Data</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchSubcategories}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Subcategories
          </h1>
          <p className="text-gray-600 text-lg">
            Category ID: <span className="font-semibold text-purple-600">{categoryId}</span>
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
        </div> */}

        {subcategories.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Subcategories Found</h3>
            <p className="text-gray-500">There are no subcategories for this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subcategories.map((subcategory) => (
              <div
                key={subcategory.id}
                onClick={() => handleSubcategoryClick(subcategory.id)}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden group"
              >
                <div className="h-48 bg-gradient-to-br from-purple-400 to-blue-500 relative overflow-hidden">
                  {subcategory.image_url ? (
                    <img
                      src={subcategory.image_url}
                      alt={subcategory.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-6xl">
                      🏷️
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                    {subcategory.name || 'Unnamed Subcategory'}
                  </h3>
                  {subcategory.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {subcategory.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                      ID: {subcategory.id}
                    </span>
                    <span className="text-purple-500 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Click on any subcategory to view products</p>
        </div>
      </div>
    </div>
  );
};

export default SubcategoryDisplay;
