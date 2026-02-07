// import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import HeroSlider from "@/components/HeroSlider";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

async function getProducts() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .limit(4); // Displaying 4 for a clean row

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return products;
}

async function getCategories(){
 const { data, error } = await supabase
  .from("categories")
  .select("*")
  .in("id", [5, 6]);

    // Displaying 4 for a clean row

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data;
}
// Category Data (Aap ise Supabase se bhi fetch kar sakte hain)
const categories1 = [
  { id: 'men', name: 'Men', image: '/men-banner.jpg' }, // Apni images public folder mein rakhein
  { id: 'women', name: 'Women', image: '/women-banner.jpg' },
  { id: 'kids', name: 'Kids', image: '/kids-banner.jpg' },
];

export default async function Home() {
  const products = await getProducts();
   const categories = await getCategories();

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <HeroSlider products={products} />

     

      {/* --- NEW ARRIVALS SECTION --- */}
   <div className="max-w-7xl mx-auto px-4 py-12">
  <div className="flex justify-between items-end mb-8">
    <h2 className="text-2xl font-bold text-black uppercase tracking-tight">
      New Arrivals
    </h2>
    <Link href="/shop" className="text-sm underline font-medium">
      View All
    </Link>
  </div>

  {products.length === 0 ? (
    <p className="text-gray-500">Loading products...</p>
  ) : (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-10 gap-x-4">
      {products.map((product) => (
        <Link
          href={`/product/${product.id}`}
          key={product.id}
          className="group cursor-pointer"
        >
          <div className="relative aspect-[3/4] w-full bg-gray-100 mb-3 overflow-hidden">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {product.category}
            </p>
            <p className="text-sm font-bold text-gray-900">
              ₹{product.price}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )}
</div>


 {/* --- H&M STYLE CATEGORY GRID --- */}
      <div className="max-w-6xl mx-auto px-4 py-16">
  <h2 className="text-center text-2xl font-bold mb-12 tracking-widest uppercase">
    Shop by Category
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8 justify-center">
    {categories.map((cat) => (
      <Link
        href={`/category/${cat.id}`}
        key={cat.id}
        className="group block mx-auto w-full max-w-sm"
      >
        <div className="relative aspect-[2/3] w-full bg-gray-100 rounded-2xl overflow-hidden">
          <Image
            src={cat.image}
            alt={cat.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Overlay */}
          <div className="absolute inset-0 flex items-end justify-center pb-8 bg-black/10 group-hover:bg-black/20 transition-all">
            <span className="bg-white text-black px-8 py-3 text-sm font-bold uppercase tracking-tight shadow-lg group-hover:bg-black group-hover:text-white transition-colors">
              {cat.name}
            </span>
          </div>
        </div>
      </Link>
    ))}
  </div>
</div>


<div className="max-w-7xl mx-auto px-4 py-12">
     <div className="flex justify-center items-center gap-6">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-2 sm:4">
<div></div>
</div>
    </div>
    </div>

</div>

  );
}