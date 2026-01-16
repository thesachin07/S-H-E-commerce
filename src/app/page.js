import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient"; // FIX: Correct filename
import Image from "next/image"; // FIX: Import Next.js Image component
import HeroSlider from "@/components/HeroSlider";
import Link from "next/link";

// 1. Data Fetching Function
async function getProducts() {
const { data: products, error } = await supabase
  .from("products")
  .select("*")
  .limit(3);

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return products;
}

// 2. Main Component
export default async function Home() {
  const products = await getProducts();

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <HeroSlider products={products} />

      {/* --- DYNAMIC PRODUCTS SECTION --- */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-black">New Arrivals</h2>

        {products.length === 0 ? (
          <p className="text-gray-500">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
            {products.map((product) => (
              <Link href={`/product/${product.id}`} key={product.id}>
              <div key={product.id} className="group cursor-pointer">
                {/* Image Container with Next.js Image */}
                <div className="relative aspect-[3/4] w-full bg-gray-100 mb-3 overflow-hidden">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
                {/* Product Info */}
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <p className="text-sm font-bold text-gray-900">
                    ${product.price}
                  </p>
                </div>
              </div>
</Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
