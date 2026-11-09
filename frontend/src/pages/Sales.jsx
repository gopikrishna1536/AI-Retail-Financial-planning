import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ShoppingBag, Search, Filter, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [regionFilter, setRegionFilter] = useState('');

  const fetchSales = async (page = 1) => {
    setLoading(true);
    try {
      let params = `?page=${page}&limit=${pagination.limit}`;
      if (startDate) params += `&start_date=${startDate}`;
      if (endDate) params += `&end_date=${endDate}`;
      if (regionFilter) params += `&region=${regionFilter}`;

      const res = await api.get(`/sales${params}`);
      if (res.success) {
        setSales(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Failed to load sales transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales(1);
  }, [startDate, endDate, regionFilter]);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Sales Module & Transaction Ledger</h1>
          <p className="text-xs text-slate-400 mt-1">Granular line-item sales orders loaded from 100,000 Kaggle store transactions</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchSales(pagination.page)}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Start Date:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">End Date:</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Region:</span>
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="">All Regions</option>
            <option value="East">East</option>
            <option value="West">West</option>
            <option value="North">North</option>
            <option value="South">South</option>
          </select>
        </div>
        {(startDate || endDate || regionFilter) && (
          <button
            onClick={() => { setStartDate(''); setEndDate(''); setRegionFilter(''); }}
            className="text-xs text-indigo-400 hover:underline font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Sales Transactions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Order ID</th>
                <th className="p-3.5">Sales Date</th>
                <th className="p-3.5">Store</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Product Name</th>
                <th className="p-3.5 text-right">Qty</th>
                <th className="p-3.5 text-right">Discount</th>
                <th className="p-3.5 text-right">Sales (₹)</th>
                <th className="p-3.5 text-right">Profit (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-slate-400">
                    <div className="flex justify-center items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                      Loading sales data...
                    </div>
                  </td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-slate-400">No sales transactions found matching filters.</td>
                </tr>
              ) : (
                sales.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-mono text-indigo-400 font-semibold">{item.order_id}</td>
                    <td className="p-3.5">{item.sales_date}</td>
                    <td className="p-3.5 font-medium text-slate-200">{item.store_code} ({item.state})</td>
                    <td className="p-3.5"><span className="px-2 py-0.5 bg-slate-800 rounded text-[11px] text-slate-300">{item.category_name}</span></td>
                    <td className="p-3.5 font-medium text-slate-200 truncate max-w-xs">{item.product_name}</td>
                    <td className="p-3.5 text-right font-mono">{item.quantity}</td>
                    <td className="p-3.5 text-right font-mono">{(item.discount * 100).toFixed(0)}%</td>
                    <td className="p-3.5 text-right font-mono font-semibold text-slate-100">₹{Number(item.sales_amount).toLocaleString('en-IN')}</td>
                    <td className="p-3.5 text-right font-mono font-semibold text-emerald-400">₹{Number(item.profit_amount).toLocaleString('en-IN')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <span className="font-semibold text-slate-200">Page {pagination.page}</span> of <span className="font-semibold text-slate-200">{pagination.totalPages}</span> ({pagination.total.toLocaleString()} records)
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={!pagination.hasPrev || loading}
              onClick={() => fetchSales(pagination.page - 1)}
              className="p-2 bg-slate-950 border border-slate-800 rounded-lg hover:bg-slate-800 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={!pagination.hasNext || loading}
              onClick={() => fetchSales(pagination.page + 1)}
              className="p-2 bg-slate-950 border border-slate-800 rounded-lg hover:bg-slate-800 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
