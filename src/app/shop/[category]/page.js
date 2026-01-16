import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
 import Link from 'next/link'; 
export default async function CategoryPage(props) {
  const params = await props.params;
  const category = params.category;

  console.log("Searching for category:", category);

  let products = [];

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("subcategory_id", category);

    if (error) throw error;
    products = data;
  } catch (err) {
    console.error("Fetch error:", err.message);
  }

  return (
  <div className="bg-white min-h-screen">
      <Navbar />
    <div className="container mx-auto pl-8 pr-8 ">
      {/* <h1 className="text-4xl font-bold uppercase mb-8 border-b pb-4">
        {category} Collection
      </h1> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
       
       {products.length > 0 ? (
    products.map((product) => (
      // Yeh component use karne se click apne aap chalne lagega
     

// ... map function ke andar ...
<Link key={product.id} href={`/product/${product.id}`} className="group cursor-pointer">
  <div className="relative h-80 w-full overflow-hidden bg-gray-100">
    <img
      src={product.image_url}
      alt={product.name}
      className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
    />
  </div>
  <div className="mt-4 flex justify-between">
    <div>
      <h3 className="text-sm text-gray-700 font-medium">
        {product.name}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {product.subcategory}
      </p>
    </div>
    <p className="text-sm font-bold text-gray-900">
      ₹{product.price}
    </p>
  </div>
</Link>
    ))
  ) : (
    <p className="col-span-full text-center py-20 text-gray-500">Empty</p>
  )}
      </div>
    </div>
    </div>
  );
}
