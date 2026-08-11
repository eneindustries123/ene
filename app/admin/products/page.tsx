import React from 'react';
import Image from 'next/image';
import { INITIAL_PRODUCTS } from '@/lib/data';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminProductsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Products & Hardware CMS</h1>
          <p className="text-xs text-slate-400">Manage published solar, wind, and storage hardware modules.</p>
        </div>

        <button className="flex items-center gap-2 bg-solix-green text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 text-slate-400 font-bold uppercase border-b border-slate-800">
            <tr>
              <th className="p-4">Product Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Warranty</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {INITIAL_PRODUCTS.map((prod) => (
              <tr key={prod.id} className="hover:bg-slate-900/50">
                <td className="p-4 font-bold text-white flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0">
                    <Image src={prod.imageUrl} alt={prod.title} fill className="object-cover" />
                  </div>
                  <span>{prod.title}</span>
                </td>
                <td className="p-4 text-slate-400">{prod.category}</td>
                <td className="p-4 text-slate-400">{prod.specifications['Warranty'] || '25 Years'}</td>
                <td className="p-4">
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/20">
                    Published
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"><Edit className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
