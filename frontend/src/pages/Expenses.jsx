import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Receipt, Plus, RefreshCw } from 'lucide-react';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/expenses');
      if (res.success) setExpenses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Expense Management</h1>
          <p className="text-xs text-slate-400 mt-1">Marketing, Staff Salaries, Rent, Utilities, Freight & Logistics Expenses</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-semibold uppercase border-b border-slate-800">
            <tr>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Store Code</th>
              <th className="p-3.5">Expense Date</th>
              <th className="p-3.5">Period</th>
              <th className="p-3.5 text-right">Amount (₹)</th>
              <th className="p-3.5">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {expenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-slate-800/40">
                <td className="p-3.5 font-bold text-indigo-400">{exp.expense_category}</td>
                <td className="p-3.5 font-medium">{exp.store_code || 'All Stores'}</td>
                <td className="p-3.5">{exp.expense_date}</td>
                <td className="p-3.5"><span className="px-2 py-0.5 bg-slate-800 rounded text-[10px]">{exp.period_type}</span></td>
                <td className="p-3.5 text-right font-mono font-semibold text-amber-400">₹{Number(exp.amount).toLocaleString('en-IN')}</td>
                <td className="p-3.5 text-slate-400">{exp.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
