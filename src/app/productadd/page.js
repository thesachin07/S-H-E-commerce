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
      setForm({ ...form, subcategory_id: data.id }); // Auto-select new subcategory
      setNewSubName("");
      setIsAddingNewSub(false);
      alert("✅ Subcategory added & selected!");
    }
  };

 const handleSubmit = async (e) => {
    e.preventDefault();

    // Payload tayyar kar rahe hain
    const payload = { 
      name: form.name,
      description: form.description,
      price: Number(form.price), 
      stock: Number(form.stock),
      image_url: form.image_url,
      category_id: form.category_id,
      subcategory_id: form.subcategory_id || null, // Empty hai toh null bhejega
      is_hero: form.is_hero
    };

    console.log("Submitting Data:", payload);

    let res;
    if (editingId) {
      res = await supabase.from("products").update(payload).eq("id", editingId);
    } else {
      // Supabase insert hamesha array leta hai
      res = await supabase.from("products").insert([payload]);
    }

    if (res.error) {
      console.error("Supabase Error:", res.error);
      alert("❌ Database Error: " + res.error.message); // Ye batayega ki table mein kya kami hai
    } else {
      alert(editingId ? "✅ Product Updated" : "✅ Product Added");
      setForm(emptyForm);
      setEditingId(null);
      fetchProducts();
      setActiveTab("products");
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

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-300 text-black flex flex-col p-5 shadow-xl">
        <h1 className="text-xl font-bold mb-10 text-blue-400">Admin Panel</h1>
        <nav className="flex flex-col gap-2">
          <button onClick={() => setActiveTab("dashboard")} className={`p-3 text-left rounded transition ${activeTab === 'dashboard' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>Dashboard</button>
          <button onClick={() => { setActiveTab("edit"); if (!editingId) setForm(emptyForm); }} className={`p-3 text-left rounded transition ${activeTab === 'edit' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>{editingId ? "Edit Product" : "Add Product"}</button>
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

        {activeTab === "edit" && (
          <div className="bg-white p-6 rounded-xl shadow border">
            <h2 className="text-2xl font-bold mb-4">{editingId ? "Edit Product" : "Add New Product"}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
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

              {/* INTEGRATED SUBCATEGORY DROPDOWN */}
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
              <button className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">{editingId ? "Update Product" : "Add Product"}</button>
            </form>
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