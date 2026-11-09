import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Package, Search } from 'lucide-react';

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/categories').then((res) => { if (res.success) setCategories(res.data); });
    api.get('/products?limit=50').then((res) => { if (res.success) setProducts(res.data); });
  }, []);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Products & Categories Hierarchy</h1>
        <p className="text-xs text-slate-400 mt-1">6 Goods Categories, 24 Sub-Categories & 21,365 Unique Product SKUs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories List */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="font-bold text-sm text-slate-100 mb-2">Categories & Sub-Categories</h3>
          <div className="space-y-2 text-xs">
            {categories.map((c) => (
              <div key={c.id} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/60 flex justify-between items-center">
                <span className="font-semibold text-slate-200">{c.sub_category_name}</span>
                <span className="text-[10px] text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded">{c.category_name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Products Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="font-bold text-sm text-slate-100">Product Merchandise Sample (50 of 21,365 SKUs)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">Product Code</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Sub-Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono text-indigo-400 font-semibold">{p.product_code}</td>
                    <td className="p-3 font-medium text-slate-200">{p.product_name}</td>
                    <td className="p-3 text-slate-400">{p.category_name}</td>
                    <td className="p-3 text-slate-400">{p.sub_category_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
