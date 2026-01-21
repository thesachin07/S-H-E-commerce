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
   
  <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-10 grid grid-cols-1 md:grid-cols-12 gap-12">
  
  {/* Left Side: Large Product Images (Span 8 columns) */}
  <div className="md:col-span-8">
    <div className="bg-[#F5F5F5] aspect-[2/3]">
      <img 
        src={product.image_url} 
        alt={product.name} 
        className="w-full h-full object-cover"
      />
    </div>
    {/* H&M aksar multi-angle shots niche ek ke baad ek dikhata hai */}
    {/* <div className="grid grid-cols-2 gap-4">
       <div className="bg-[#F5F5F5] aspect-[2/3]"></div>
       <div className="bg-[#F5F5F5] aspect-[2/3]"></div>
    </div> */}
  </div>

  {/* Right Side: Product Details (Span 4 columns) - Sticky behavior */}
  <div className="md:col-span-4 self-start sticky top-24">
    <div className="flex flex-col">
      <h1 className="text-xl font-medium uppercase tracking-tight mb-2">
        {product.name}
      </h1>
      
      <p className="text-lg font-normal mb-6">
        ₹{product.price}.00
      </p>

      {/* Size Selector (H&M Signature style) */}
      <div className="mb-6">
        <p className="text-sm font-semibold mb-3">SELECT SIZE</p>
        <div className="grid grid-cols-4 gap-2">
          {['S', 'M', 'L', 'XL'].map((size) => (
            <button key={size} className="border border-gray-300 py-2 text-sm hover:border-black transition">
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Add to Cart Button */}
      <button 
        onClick={() => addToCart(product)}
        className="bg-black text-white py-4 px-8 w-full flex items-center justify-center gap-2 hover:bg-[#222] transition-colors"
      >
        <span className="text-sm font-bold uppercase tracking-widest">Add to Bag</span>
      </button>

      {/* Secondary Info */}
      <div className="mt-10 space-y-4 border-t pt-6">
        <details className="cursor-pointer group">
          <summary className="list-none flex justify-between items-center text-sm font-medium">
            DESCRIPTION & FIT <span className="group-open:rotate-180 transition-transform">↓</span>
          </summary>
          <p className="text-sm text-gray-600 mt-3 leading-relaxed">
            {product.description}
          </p>
        </details>
        
        <details className="cursor-pointer group border-t pt-4">
          <summary className="list-none flex justify-between items-center text-sm font-medium">
            MATERIALS & CARE <span className="group-open:rotate-180 transition-transform">↓</span>
          </summary>
          <p className="text-sm text-gray-600 mt-3">
            100% Organic Cotton. Machine wash at 40°.
          </p>
        </details>
      </div>
    </div>
  </div>
</div>
  );
}