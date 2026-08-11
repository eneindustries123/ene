import React from 'react';
import { Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

export default function AdminQuotesPage() {
  const quotes = [
    {
      id: 'q-101',
      name: 'Elena Rostova',
      company: 'Alpine Clean Grid Alliance',
      email: 'e.rostova@alpine-grid.de',
      phone: '+49 89 1234 5678',
      type: 'Wind + Storage Hybrid',
      capacity: '15 MW',
      date: 'Aug 6, 2026',
      status: 'Pending Review',
    },
    {
      id: 'q-102',
      name: 'Marcus Vance',
      company: 'Vance Industrial Logistics',
      email: 'marcus@vance-logistics.com',
      phone: '+1 (555) 392-1049',
      type: 'Commercial Solar Rooftop',
      capacity: '3.5 MW',
      date: 'Aug 5, 2026',
      status: 'Quotation Sent',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Customer Quote Requests</h1>
          <p className="text-xs text-slate-400">Review incoming engineering estimates and proposal requests.</p>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 text-slate-400 font-bold uppercase border-b border-slate-800">
            <tr>
              <th className="p-4">Contact</th>
              <th className="p-4">Company</th>
              <th className="p-4">Solution Scope</th>
              <th className="p-4">Target Capacity</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {quotes.map((q) => (
              <tr key={q.id} className="hover:bg-slate-900/50">
                <td className="p-4 font-bold text-white">
                  <div>{q.name}</div>
                  <div className="text-[10px] text-slate-400 font-normal">{q.email}</div>
                </td>
                <td className="p-4 text-slate-400">{q.company}</td>
                <td className="p-4 text-emerald-400 font-medium">{q.type}</td>
                <td className="p-4 font-bold text-white">{q.capacity}</td>
                <td className="p-4 text-slate-400">{q.date}</td>
                <td className="p-4">
                  <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-500/20">
                    {q.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
