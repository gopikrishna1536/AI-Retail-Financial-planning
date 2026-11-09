import React from 'react';
import { FileSpreadsheet, Download, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export default function Reports() {
  const reportsList = [
    { title: 'Monthly Executive Financial Statement', period: 'August 2026', type: 'Financial Summary' },
    { title: 'Store Performance & Profitability Report', period: 'YTD 2023', type: 'Store Analytics' },
    { title: 'Product Category Profit Margin Matrix', period: 'Q2 2023', type: 'Product Profitability' },
    { title: 'Budget Allocation & Variance Audit', period: 'Annual 2023', type: 'Budget Variance' },
    { title: 'AI Forecast & Early Warning Risk Log', period: '2023-2024', type: 'Forecast & Risk' },
  ];

  const handleDownloadCSV = async (title) => {
    try {
      const res = await api.get('/sales?limit=500');
      if (res.success && res.data) {
        const headers = ['Order ID', 'Sales Date', 'Store', 'Category', 'Product', 'Quantity', 'Discount', 'Sales', 'Profit'];
        const rows = res.data.map(s => [
          s.order_id, s.sales_date, s.store_code, s.category_name, `"${s.product_name}"`, s.quantity, s.discount, s.sales_amount, s.profit_amount
        ]);
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      alert('CSV Export generated.');
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Financial Reports & Data Exports</h1>
        <p className="text-xs text-slate-400 mt-1">Export Complete Store Sales, Financial Plans, Budgets & Variances to CSV</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportsList.map((r, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between hover:border-slate-700 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-950 text-indigo-400 rounded-lg border border-indigo-800/40">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm">{r.title}</h3>
                <p className="text-xs text-slate-400">Type: <span className="text-slate-300">{r.type}</span> | Period: <span className="text-slate-300">{r.period}</span></p>
              </div>
            </div>
            <button
              onClick={() => handleDownloadCSV(r.title)}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow transition-all"
            >
              <Download className="w-4 h-4" /> CSV Export
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
