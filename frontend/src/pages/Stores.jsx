import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Store,
  MapPin,
  Building2,
  Search,
  Filter,
  Phone,
  Clock,
  User,
  Compass,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Layers,
  Sparkles,
  Building
} from 'lucide-react';

const CITY_OPTIONS = [
  { label: 'All Cities & Territories (30 Stores)', value: '' },
  { label: 'Delhi NCR (Connaught Place • 110001)', value: 'Delhi' },
  { label: 'Maharashtra (Mumbai • 400001)', value: 'Maharashtra' },
  { label: 'Karnataka (Bengaluru • 560001)', value: 'Karnataka' },
  { label: 'Tamil Nadu (Chennai • 600001)', value: 'Tamil Nadu' },
  { label: 'West Bengal (Kolkata • 700001)', value: 'West Bengal' },
  { label: 'Gujarat (Ahmedabad • 380001)', value: 'Gujarat' },
  { label: 'Rajasthan (Jaipur • 302001)', value: 'Rajasthan' },
  { label: 'Punjab (Chandigarh • 160001)', value: 'Punjab' },
  { label: 'Uttar Pradesh (Lucknow • 226001)', value: 'Uttar Pradesh' },
  { label: 'Madhya Pradesh (Bhopal • 462001)', value: 'Madhya Pradesh' },
];

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedOutlet, setSelectedOutlet] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedState) params.append('state', selectedState);
    if (selectedOutlet) params.append('outlet_type', selectedOutlet);
    if (selectedRegion) params.append('region', selectedRegion);

    api.get(`/stores?${params.toString()}`)
      .then((res) => {
        if (res.success) {
          setStores(res.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedState, selectedOutlet, selectedRegion]);

  const filteredStores = stores.filter((s) => {
    const term = searchTerm.toLowerCase();
    const matchesCode = s.store_code?.toLowerCase().includes(term);
    const matchesLocality = s.locality?.toLowerCase().includes(term);
    const matchesAddress = s.address?.toLowerCase().includes(term);
    const matchesLandmark = s.landmark?.toLowerCase().includes(term);
    const matchesManager = s.manager_name?.toLowerCase().includes(term);
    const matchesState = s.state?.toLowerCase().includes(term);
    return matchesCode || matchesLocality || matchesAddress || matchesLandmark || matchesManager || matchesState;
  });

  const totalSqft = filteredStores.reduce((sum, s) => sum + (s.sqft || 0), 0);
  const totalStaff = filteredStores.reduce((sum, s) => sum + (s.staff_count || 0), 0);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-950 text-indigo-400 border border-indigo-800/50">
              Enterprise Physical Assets Directory
            </span>
            <span className="text-xs text-slate-400 font-medium">• 30 Commercial Properties</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2.5">
            Stores Management & Physical Outlets
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete registry of physical retail outlets with verified street addresses, micro-market localities, operating hours, and on-site store managers.
          </p>
        </div>

        <button
          onClick={() => navigate('/store-profit-pathway')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/30 shrink-0"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>5-Year Profit Pathways</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-[11px] text-slate-400 font-medium">Active Operating Stores</p>
          <p className="text-2xl font-black text-slate-100 mt-1">{filteredStores.length}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Across 10 primary Indian hubs</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-[11px] text-slate-400 font-medium">Total Retail Floor Space</p>
          <p className="text-2xl font-black text-indigo-400 mt-1">{totalSqft.toLocaleString()} sq ft</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Commercial leased footprint</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-[11px] text-slate-400 font-medium">Frontline Store Associates</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{totalStaff} Associates</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Customer sales & cashier workforce</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-[11px] text-slate-400 font-medium">Network Formats</p>
          <p className="text-2xl font-black text-amber-400 mt-1">3 Formats</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Hypermarket, Supermarket, Express</p>
        </div>
      </div>

      {/* FILTER TOOLBAR WITH EXPLICIT DROPDOWNS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Filter Outlets by Specific Location & Format
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Location / Territory Dropdown */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-transparent border-none text-slate-100 text-xs font-semibold focus:outline-none cursor-pointer w-full"
            >
              {CITY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value} className="bg-slate-900">
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Format / Size Dropdown */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs flex items-center gap-2">
            <Building className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedOutlet}
              onChange={(e) => setSelectedOutlet(e.target.value)}
              className="bg-transparent border-none text-slate-100 text-xs font-semibold focus:outline-none cursor-pointer w-full"
            >
              <option value="" className="bg-slate-900">All Formats (Large, Medium, Small)</option>
              <option value="Large" className="bg-slate-900">Large Flagship Hypermarket (12k sqft)</option>
              <option value="Medium" className="bg-slate-900">Medium Supermarket (6.5k sqft)</option>
              <option value="Small" className="bg-slate-900">Small Express Mart (3.2k sqft)</option>
            </select>
          </div>

          {/* 3. Region Dropdown */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-transparent border-none text-slate-100 text-xs font-semibold focus:outline-none cursor-pointer w-full"
            >
              <option value="" className="bg-slate-900">All Geographic Regions</option>
              <option value="North" className="bg-slate-900">North Region (Delhi, Punjab, UP)</option>
              <option value="South" className="bg-slate-900">South Region (Bengaluru, Chennai)</option>
              <option value="West" className="bg-slate-900">West Region (Mumbai, Gujarat, Jaipur)</option>
              <option value="East" className="bg-slate-900">East Region (Kolkata)</option>
            </select>
          </div>

          {/* 4. Text Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search address, locality, landmark..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Stores Directory Grid with Specific Physical Location Details */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-indigo-400 text-xs font-semibold gap-2">
          <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <span>Loading specific store locations...</span>
        </div>
      ) : filteredStores.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
          No stores match the selected filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStores.map((s) => (
            <div
              key={s.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-indigo-500/40 transition-all flex flex-col justify-between shadow-lg shadow-black/20"
            >
              <div className="space-y-3">
                {/* Store Header Badges */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-indigo-400 bg-indigo-950/80 px-2.5 py-0.5 rounded-lg border border-indigo-800/50">
                      {s.store_code}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-800 rounded-md text-[10px] font-semibold text-slate-300">
                      {s.outlet_type}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {s.city_type} • {s.region}
                  </span>
                </div>

                {/* Specific Locality & Micro-Market */}
                <div className="space-y-1">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-100 leading-snug">
                        {s.locality || `${s.state} Retail Location`}
                      </h3>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                        {s.address || `Central High Street, ${s.state} - ${s.postal_code}`}
                      </p>
                    </div>
                  </div>

                  {s.landmark && (
                    <div className="text-[11px] text-slate-400 pl-6 flex items-center gap-1.5 pt-0.5">
                      <span className="text-amber-400 font-semibold">Landmark:</span>
                      <span>{s.landmark}</span>
                    </div>
                  )}
                </div>

                {/* Trading Specifications */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                    <span className="text-slate-400 text-[10px] block">Trading Format</span>
                    <span className="text-slate-200 font-medium">{s.trading_format || `${s.outlet_type} Format`}</span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                    <span className="text-slate-400 text-[10px] block">Floor Space</span>
                    <span className="text-indigo-300 font-semibold">{(s.sqft || 5000).toLocaleString()} sq ft</span>
                  </div>
                </div>

                {/* Operational Details: Manager, Contact, Hours */}
                <div className="space-y-1.5 pt-1 text-[11px] text-slate-300">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Manager: <strong className="text-slate-200">{s.manager_name || 'Store Manager'}</strong> ({s.staff_count || 12} staff)</span>
                  </div>
                  {s.contact_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{s.contact_phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Hours: {s.operating_hours || '08:00 AM - 10:00 PM'}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">PIN: {s.postal_code}</span>
                <button
                  onClick={() => navigate('/store-profit-pathway')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <span>5-Year Pathway</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
