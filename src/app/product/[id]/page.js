"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient"; 
import { useCart } from "@/context/CartContext";
import { useParams } from "next/navigation";

export default function ProductDetail() {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart(); 

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single(); // Specific product fetch karna 

      if (!error) setProduct(data);
      setLoading(false);
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading product...</p>;
  if (!product) return <p className="text-center mt-10">Empty!</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Product Image [cite: 41] */}
      <div className="bg-gray-100 rounded-lg overflow-hidden">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info [cite: 41] */}
      <div className="flex flex-col justify-center">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-xl text-gray-700 mb-6">₹{product.price}</p>
        <p className="text-gray-600 mb-8">{product.description}</p>
        
        {/* Add to Cart Button  */}
        <button 
          onClick={() => addToCart(product)}
          className="bg-black text-white py-4 px-8 rounded-full hover:bg-gray-800 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}