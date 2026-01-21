"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminProducts() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // --- NEW STATE FOR ADDING SUBCATEGORY ---
  const [isAddingNewSub, setIsAddingNewSub] = useState(false);
  const [newSubName, setNewSubName] = useState("");

  // --- BULK UPLOAD STATE ---
  const [bulkData, setBulkData] = useState("");
  const [uploadProgress, setUploadProgress] = useState("");

  const emptyForm = {
    name: "",
    description: "",
    price: "",
    stock: "",
    image_url: "",
    category_id: "",
    subcategory_id: "",
    is_hero: false,
  };

  const [form, setForm] = useState(emptyForm);

  /* ================= FETCH LOGIC ================= */
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories ( name ),
        subcategories ( name )
      `)
      .order("id", { ascending: false });

    if (error) {
      console.error("Fetch Error:", error);
    } else {
      setProducts(data || []);
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*");
    setCategories(data || []);
  };

  const fetchSubCategories = async (catId) => {
    const { data } = await supabase.from("subcategories").select("*").eq("category_id", catId);
    setSubcategories(data || []);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // --- NEW HANDLER FOR SAVING NEW SUBCATEGORY ---
  const handleSaveSubcategory = async () => {
    if (!form.category_id) return alert("Pehle Category select karo!");
    if (!newSubName.trim()) return;

    const { data, error } = await supabase
      .from("subcategories")
      .insert([{ name: newSubName, category_id: form.category_id }])
      .select()
      .single();

    if (error) {
      alert("Error: " + error.message);
    } else {
      setSubcategories([...subcategories, data]);
      setForm({ ...form, subcategory_id: data.id });
      setNewSubName("");
      setIsAddingNewSub(false);
      alert("✅ Subcategory added & selected!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { 
      name: form.name,
      description: form.description,
      price: Number(form.price), 
      stock: Number(form.stock),
      image_url: form.image_url,
      category_id: form.category_id,
      subcategory_id: form.subcategory_id || null,
      is_hero: form.is_hero
    };

    console.log("Submitting Data:", payload);

    let res;
    if (editingId) {
      res = await supabase.from("products").update(payload).eq("id", editingId);
    } else {
      res = await supabase.from("products").insert([payload]);
    }

    if (res.error) {
      console.error("Supabase Error:", res.error);
      alert("❌ Database Error: " + res.error.message);
    } else {
      alert(editingId ? "✅ Product Updated" : "✅ Product Added");
      setForm(emptyForm);
      setEditingId(null);
      fetchProducts();
      setActiveTab("products");
    }
  };

  // --- BULK UPLOAD HANDLER ---
  const handleBulkUpload = async () => {
    if (!bulkData.trim()) {
      alert("Please paste CSV data!");
      return;
    }

    setUploadProgress("Processing...");
    const lines = bulkData.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const productsToInsert = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const product = {};
      
      headers.forEach((header, index) => {
        if (header === 'price' || header === 'stock' || header === 'category_id' || header === 'subcategory_id') {
          product[header] = values[index] ? Number(values[index]) : null;
        } else if (header === 'is_hero') {
          product[header] = values[index] === 'true' || values[index] === '1';
        } else {
          product[header] = values[index] || null;
        }
      });
      
      productsToInsert.push(product);
    }

    setUploadProgress(`Uploading ${productsToInsert.length} products...`);

    const { data, error } = await supabase
      .from("products")
      .insert(productsToInsert);

    if (error) {
      setUploadProgress("❌ Error: " + error.message);
      console.error("Bulk Upload Error:", error);
    } else {
      setUploadProgress(`✅ Successfully uploaded ${productsToInsert.length} products!`);
      setBulkData("");
      fetchProducts();
      setTimeout(() => {
        setUploadProgress("");
        setActiveTab("products");
      }, 2000);
    }
  };

  const editProduct = async (product) => {
    setEditingId(product.id);
    const { data } = await supabase.from("products").select("*").eq("id", product.id).single();
    setForm(data);
    if (data.category_id) fetchSubCategories(data.category_id);
    setActiveTab("edit");
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  // --- CREATE SUBCATEGORIES FOR MEN (5) & WOMEN (6) ---
  const setupCategoriesAndSubcategories = async () => {
    setUploadProgress("Setting up subcategories...");
    
    const subcategoriesData = [
      // Men's Subcategories (category_id: 5)
      { id: 1, name: "T-Shirts", category_id: 5 },
      { id: 2, name: "Shirts", category_id: 5 },
      { id: 3, name: "Jeans", category_id: 5 },
      { id: 4, name: "Trousers", category_id: 5 },
      { id: 5, name: "Jackets", category_id: 5 },
      { id: 6, name: "Shoes", category_id: 5 },
      { id: 7, name: "Sneakers", category_id: 5 },
      { id: 8, name: "Formal Shoes", category_id: 5 },
      { id: 9, name: "Watches", category_id: 5 },
      { id: 10, name: "Wallets", category_id: 5 },
      { id: 11, name: "Belts", category_id: 5 },
      { id: 12, name: "Caps", category_id: 5 },
      { id: 13, name: "Hoodies", category_id: 5 },
      { id: 14, name: "Sweaters", category_id: 5 },
      { id: 15, name: "Sportswear", category_id: 5 },
      
      // Women's Subcategories (category_id: 6)
      { id: 16, name: "Tops", category_id: 6 },
      { id: 17, name: "Dresses", category_id: 6 },
      { id: 18, name: "Jeans", category_id: 6 },
      { id: 19, name: "Skirts", category_id: 6 },
      { id: 20, name: "Jackets", category_id: 6 },
      { id: 21, name: "Heels", category_id: 6 },
      { id: 22, name: "Sandals", category_id: 6 },
      { id: 23, name: "Flats", category_id: 6 },
      { id: 24, name: "Handbags", category_id: 6 },
      { id: 25, name: "Jewelry", category_id: 6 },
      { id: 26, name: "Scarves", category_id: 6 },
      { id: 27, name: "Sunglasses", category_id: 6 },
      { id: 28, name: "Kurtas", category_id: 6 },
      { id: 29, name: "Sarees", category_id: 6 },
      { id: 30, name: "Activewear", category_id: 6 }
    ];

    try {
      // Insert subcategories
      for (const sub of subcategoriesData) {
        await supabase.from("subcategories").upsert(sub, { onConflict: 'id' });
      }

      setUploadProgress("✅ Subcategories created!");
      fetchCategories();
      setTimeout(() => setUploadProgress(""), 2000);
    } catch (error) {
      setUploadProgress("❌ Error creating subcategories: " + error.message);
    }
  };

  // --- LOAD SAMPLE DATA ---
  const loadSampleData = () => {
    const sampleCSV = `name,description,price,stock,image_url,category_id,subcategory_id,is_hero
Classic Cotton T-Shirt Blue,Premium 100% cotton casual tee for men,499,200,https://images.unsplash.com/photo-1521572163474-6864f9cf17ab,5,1,false
Slim Fit Denim Jeans,Comfortable stretch denim for everyday wear,1999,100,https://images.unsplash.com/photo-1542272604-787c3835535d,5,3,true
Leather Jacket Black,Genuine leather biker jacket for men,8999,25,https://images.unsplash.com/photo-1551028719-00167b16eac5,5,5,false
Running Shoes Pro,Lightweight athletic shoes with cushioning,3499,80,https://images.unsplash.com/photo-1542291026-7eec264c27ff,5,6,false
Formal Shirt White,Wrinkle-free cotton formal shirt,1299,120,https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf,5,2,false
Pullover Hoodie Grey,Warm fleece pullover hoodie,1799,90,https://images.unsplash.com/photo-1556821840-3a63f95609a7,5,13,false
Winter Puffer Jacket,Insulated water-resistant jacket,4999,50,https://images.unsplash.com/photo-1539533018447-63fcce2678e3,5,5,false
White Sneakers,Classic casual canvas sneakers,2299,110,https://images.unsplash.com/photo-1549298916-b41d501d3772,5,7,false
Sports Watch Digital,Water-resistant fitness tracking watch,2999,65,https://images.unsplash.com/photo-1523275335684-37898b6baf30,5,9,false
Leather Wallet Brown,Genuine leather bifold wallet,899,150,https://images.unsplash.com/photo-1627123424574-724758594e93,5,10,false
Casual Belt Black,Reversible leather belt,599,180,https://images.unsplash.com/photo-1624222247344-550fb60583b8,5,11,false
Baseball Cap Navy,Adjustable cotton sports cap,399,200,https://images.unsplash.com/photo-1588850561407-ed78c282e89b,5,12,false
Polo T-Shirt Red,Classic fit polo with collar,799,140,https://images.unsplash.com/photo-1607734834374-f0651cc8c6a3,5,1,false
Chino Trousers Khaki,Smart casual cotton trousers,1699,85,https://images.unsplash.com/photo-1473966968600-fa801b869a1a,5,4,false
Wool Sweater Grey,Premium merino wool pullover,2499,60,https://images.unsplash.com/photo-1576566588028-4147f3842f27,5,14,false
Track Pants Black,Comfortable athletic pants,1299,120,https://images.unsplash.com/photo-1506629082955-511b1aa562c8,5,15,false
Oxford Formal Shoes,Classic leather dress shoes,3999,45,https://images.unsplash.com/photo-1614252235316-8c857d38b5f4,5,8,false
Graphic T-Shirt White,Trendy printed cotton tee,599,170,https://images.unsplash.com/photo-1583743814966-8936f5b7be1a,5,1,false
Bomber Jacket Green,Stylish lightweight bomber,3499,55,https://images.unsplash.com/photo-1591047139829-d91aecb6caea,5,5,false
Sports Shorts Blue,Quick-dry workout shorts,799,130,https://images.unsplash.com/photo-1591195853828-11db59a44f6b,5,15,false
Checkered Shirt Blue,Classic flannel shirt,1199,95,https://images.unsplash.com/photo-1596755094514-f87e34085b2c,5,2,false
Loafer Shoes Brown,Casual slip-on loafers,2799,70,https://images.unsplash.com/photo-1533867617858-e7b97e060509,5,6,false
Denim Jacket Light Blue,Classic trucker style jacket,3299,50,https://images.unsplash.com/photo-1576995853123-5a10305d93c0,5,5,false
Cotton Henley Shirt,Long sleeve casual henley,999,110,https://images.unsplash.com/photo-1620799140408-edc6dcb6d633,5,2,false
Running Sneakers White,Cushioned running shoes,2999,80,https://images.unsplash.com/photo-1600185365483-26d7a4cc7519,5,7,false
Floral Print Top,Elegant sleeveless floral top,799,150,https://images.unsplash.com/photo-1564257577-2d9d8e92e15f,6,16,false
Maxi Dress Summer,Flowing summer dress with print,2499,85,https://images.unsplash.com/photo-1595777457583-95e059d581b8,6,17,true
Skinny Jeans Dark Blue,Stretchable skinny fit jeans,1899,110,https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec,6,18,false
Pleated Skirt Black,Elegant knee-length pleated skirt,1299,95,https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa,6,19,false
Denim Jacket Cropped,Trendy cropped denim jacket,2999,60,https://images.unsplash.com/photo-1601333144130-8cbb312386b6,6,20,false
Stiletto Heels Red,Classic pointed toe heels,3499,40,https://images.unsplash.com/photo-1543163521-1bf539c55dd2,6,21,false
Leather Sandals Tan,Comfortable flat sandals,1499,120,https://images.unsplash.com/photo-1603487742131-4160ec999306,6,22,false
Ballet Flats Black,Classic comfortable flats,1799,100,https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d,6,23,false
Designer Handbag,Elegant leather shoulder bag,4999,35,https://images.unsplash.com/photo-1584917865442-de89df76afd3,6,24,false
Gold Necklace Set,Elegant jewelry set with earrings,2499,70,https://images.unsplash.com/photo-1515562141207-7a88fb7ce338,6,25,false
Silk Scarf Floral,Premium printed silk scarf,899,140,https://images.unsplash.com/photo-1601924994987-69e26d50dc26,6,26,false
Cat Eye Sunglasses,Trendy UV protection sunglasses,1299,90,https://images.unsplash.com/photo-1511499767150-a48a237f0083,6,27,false
Cotton Kurta White,Comfortable ethnic kurta,1599,105,https://images.unsplash.com/photo-1610030469983-98e550d6193c,6,28,false
Designer Saree Silk,Elegant silk saree with blouse,5999,25,https://images.unsplash.com/photo-1610030469969-d98929d6f0c8,6,29,true
Sports Bra Black,High support workout bra,799,160,https://images.unsplash.com/photo-1606902965551-dce093cda6e7,6,30,false
Yoga Pants Purple,Stretchable yoga leggings,1199,130,https://images.unsplash.com/photo-1506629082955-511b1aa562c8,6,30,false
Chiffon Blouse Pink,Elegant office wear blouse,1499,80,https://images.unsplash.com/photo-1624206112918-f140f087f9b5,6,16,false
A-Line Dress Navy,Classic cocktail dress,2799,55,https://images.unsplash.com/photo-1572804013309-59a88b7e92f1,6,17,false
High-Waist Jeans,Vintage style high-waist denim,2199,75,https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0,6,18,false
Midi Skirt Floral,Flowing floral print skirt,1699,65,https://images.unsplash.com/photo-1590678961230-b1778efff52f,6,19,false
Leather Jacket Brown,Genuine leather biker jacket,7999,30,https://images.unsplash.com/photo-1551028719-00167b16eac5,6,20,false
Block Heels Nude,Comfortable block heel sandals,2799,60,https://images.unsplash.com/photo-1543163521-1bf539c55dd2,6,21,false
Gladiator Sandals,Trendy strappy sandals,1899,85,https://images.unsplash.com/photo-1562183241-b937e95585b6,6,22,false
Slip-On Sneakers White,Casual comfortable sneakers,1599,110,https://images.unsplash.com/photo-1603808033192-082d6919d3e1,6,23,false
Crossbody Bag Beige,Compact everyday sling bag,1999,95,https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d,6,24,false
Silver Bracelet,Elegant charm bracelet,1799,80,https://images.unsplash.com/photo-1611591437281-460bfbe1220a,6,25,false
Pashmina Shawl Red,Soft wool blend shawl,1499,70,https://images.unsplash.com/photo-1601924994987-69e26d50dc26,6,26,false
Round Sunglasses Black,Classic vintage style sunglasses,999,120,https://images.unsplash.com/photo-1572635196237-14b3f281503f,6,27,false`;
    
    setBulkData(sampleCSV);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-300 text-black flex flex-col p-5 shadow-xl">
        <h1 className="text-xl font-bold mb-10 text-blue-400">Admin Panel</h1>
        <nav className="flex flex-col gap-2">
          <button onClick={() => setActiveTab("dashboard")} className={`p-3 text-left rounded transition ${activeTab === 'dashboard' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>Dashboard</button>
          <button onClick={() => { setActiveTab("edit"); if (!editingId) setForm(emptyForm); }} className={`p-3 text-left rounded transition ${activeTab === 'edit' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>{editingId ? "Edit Product" : "Add Product"}</button>
          <button onClick={() => setActiveTab("bulk")} className={`p-3 text-left rounded transition ${activeTab === 'bulk' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>Bulk Upload</button>
          <button onClick={() => setActiveTab("products")} className={`p-3 text-left rounded transition ${activeTab === 'products' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>Products List</button>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === "dashboard" && (
          <div className="bg-white p-10 rounded-xl shadow-sm border text-center">
            <h2 className="text-3xl font-bold text-gray-800">Welcome, Admin!</h2>
            <p className="text-gray-500 mt-2">Manage your inventory from the sidebar.</p>
          </div>
        )}

        {activeTab === "bulk" && (
          <div className="bg-white p-6 rounded-xl shadow border">
            <h2 className="text-2xl font-bold mb-4">Bulk Product Upload</h2>
            <p className="text-gray-600 mb-4">Paste CSV data below. Format: name,description,price,stock,image_url,category_id,subcategory_id,is_hero</p>
            
            <div className="mb-4 flex gap-3">
              <button 
                onClick={setupCategoriesAndSubcategories}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
              >
                Step 1: Setup Subcategories (Men & Women)
              </button>
              <button 
                onClick={loadSampleData}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Step 2: Load 50 Sample Products
              </button>
            </div>

            <textarea
              className="w-full h-96 border p-3 rounded font-mono text-sm"
              placeholder="Paste CSV data here..."
              value={bulkData}
              onChange={(e) => setBulkData(e.target.value)}
            />
            
            {uploadProgress && (
              <div className={`mt-4 p-3 rounded ${uploadProgress.includes('✅') ? 'bg-green-100 text-green-800' : uploadProgress.includes('❌') ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                {uploadProgress}
              </div>
            )}

            <div className="mt-4 flex gap-3">
              <button 
                onClick={handleBulkUpload}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Upload Products
              </button>
              <button 
                onClick={() => setBulkData("")}
                className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {activeTab === "edit" && (
          <div className="bg-white p-6 rounded-xl shadow border">
            <h2 className="text-2xl font-bold mb-4">{editingId ? "Edit Product" : "Add New Product"}</h2>
            <div className="grid grid-cols-2 gap-4">
              <input className="input border p-2 rounded" name="name" placeholder="Name" value={form.name} onChange={handleChange} />
              <input className="input border p-2 rounded" name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} />
              <input className="input border p-2 rounded" name="image_url" placeholder="Image URL" value={form.image_url} onChange={handleChange} />
              <input className="input border p-2 rounded" name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} />

              <select
                name="category_id"
                className="input border p-2 rounded"
                value={form.category_id}
                onChange={(e) => {
                  handleChange(e);
                  fetchSubCategories(e.target.value);
                }}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>

              <div className="flex flex-col gap-2">
                {!isAddingNewSub ? (
                  <select
                    name="subcategory_id"
                    className="input border p-2 rounded"
                    value={form.subcategory_id}
                    onChange={(e) => {
                      if (e.target.value === "ADD_NEW") {
                        setIsAddingNewSub(true);
                      } else {
                        handleChange(e);
                      }
                    }}
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                    <option value="ADD_NEW" className="text-blue-600 font-bold">+ Add New Subcategory</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input className="input border p-2 rounded flex-1" placeholder="New Sub Name" value={newSubName} onChange={(e) => setNewSubName(e.target.value)} autoFocus />
                    <button type="button" onClick={handleSaveSubcategory} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                    <button type="button" onClick={() => { setIsAddingNewSub(false); setNewSubName(""); }} className="bg-gray-400 text-white px-3 py-1 rounded">✕</button>
                  </div>
                )}
              </div>

              <textarea className="input col-span-2 border p-2 rounded" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
              <label className="flex items-center gap-2 col-span-2">
                <input type="checkbox" name="is_hero" checked={form.is_hero} onChange={handleChange} /> Show in Hero Section
              </label>
              <button onClick={handleSubmit} className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">{editingId ? "Update Product" : "Add Product"}</button>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="bg-white p-6 rounded-xl shadow border">
            <h2 className="text-2xl font-bold mb-4">All Products ({products.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full border text-left">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="p-3 border">Name</th>
                    <th className="p-3 border">Category</th>
                    <th className="p-3 border">Price</th>
                    <th className="p-3 border">Stock</th>
                    <th className="p-3 border">Hero</th>
                    <th className="p-3 border text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="border p-3">{p.name}</td>
                      <td className="border p-3 text-sm text-gray-600">{p.categories?.name || 'N/A'}</td>
                      <td className="border p-3">₹{p.price}</td>
                      <td className="border p-3 font-mono">{p.stock}</td>
                      <td className="border p-3">{p.is_hero ? "Yes" : "No"}</td>
                      <td className="border p-3 flex gap-2 justify-center">
                        <button onClick={() => editProduct(p)} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">Edit</button>
                        <button onClick={() => deleteProduct(p.id)} className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}