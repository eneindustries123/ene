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
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-solix-border pb-6">
        <div>
          <span className="text-xs font-bold text-solix-green uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-solix-border">
            Inquiries & Leads
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-solix-dark tracking-tight mt-2">
            Customer Quote Requests
          </h1>
          <p className="text-xs text-solix-muted mt-1">
            Review incoming engineering estimates and proposal requests.
          </p>
        </div>
      </div>

      {/* Quote Requests Table */}
      <div className="bg-white border border-solix-border rounded-3xl overflow-hidden shadow-solix">
        <table className="w-full text-left text-xs text-solix-dark">
          <thead className="bg-solix-bg text-solix-muted font-bold uppercase border-b border-solix-border text-[11px]">
            <tr>
              <th className="p-4">Contact</th>
              <th className="p-4">Company</th>
              <th className="p-4">Solution Scope</th>
              <th className="p-4">Target Capacity</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-solix-border/60">
            {quotes.map((q) => (
              <tr key={q.id} className="hover:bg-solix-bg/50 transition-colors">
                <td className="p-4 font-bold text-solix-dark">
                  <div>{q.name}</div>
                  <div className="text-[10px] text-solix-muted font-normal">{q.email}</div>
                </td>
                <td className="p-4 text-solix-muted font-medium">{q.company}</td>
                <td className="p-4 text-solix-green font-bold">{q.type}</td>
                <td className="p-4 font-extrabold text-solix-dark">{q.capacity}</td>
                <td className="p-4 text-solix-muted">{q.date}</td>
                <td className="p-4">
                  <span className="bg-amber-500/10 text-amber-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-500/20">
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
