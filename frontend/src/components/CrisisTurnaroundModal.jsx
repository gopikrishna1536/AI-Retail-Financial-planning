import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  AlertOctagon,
  X,
  Printer,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  FileText
} from 'lucide-react';

export default function CrisisTurnaroundModal({ isOpen, onClose }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.get('/risk-alerts/turnaround-report')
        .then(res => {
          if (res.success) setReport(res.data);
        })
        .catch(err => console.error('Failed to load turnaround report:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-950/60 px-2.5 py-0.5 rounded border border-rose-800/40">
                {report?.crisis_classification || 'TIER-1 FINANCIAL EMERGENCY / TURNAROUND PROTOCOL'}
              </span>
              <h2 className="text-lg font-bold text-slate-100 mt-1">
                Executive Crisis Turnaround Blueprint & Financial Recovery Plan
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              Print Report
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {loading ? (
            <div className="py-20 text-center text-indigo-400">
              Loading Forensic Turnaround Audit...
            </div>
          ) : (
            <>
              {/* Executive Crisis Summary */}
              <div className="bg-rose-950/20 border border-rose-900/40 p-5 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Executive Diagnosis & Crisis Mandate</span>
                </div>
                <p className="leading-relaxed text-slate-300">
                  {report?.executive_summary?.primary_diagnosis}
                </p>
                <div className="pt-2 text-[11px] font-semibold text-rose-300">
                  Immediate Mandate: {report?.executive_summary?.immediate_mandate}
                </div>
              </div>

              {/* Forensic Leakage Analysis */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  Forensic Financial Leakage Breakdown (Where Money is Being Lost)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {report?.leakage_forensics?.map((item, idx) => (
                    <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">{item.leakage_area}</span>
                        <span className="font-extrabold text-rose-400">{item.estimated_annual_loss}</span>
                      </div>
                      <p className="text-[11px] text-slate-400"><strong className="text-slate-300">Root Cause:</strong> {item.root_cause}</p>
                      <div className="text-[11px] text-emerald-400 bg-emerald-950/30 px-2.5 py-1.5 rounded border border-emerald-800/30">
                        <strong>Remedy:</strong> {item.remedy}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4-Phase Turnaround Roadmap */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  4-Phase Turnaround Execution Blueprint (Step-by-Step Recovery)
                </h3>
                <div className="space-y-3">
                  {report?.turnaround_phases?.map((phase, idx) => (
                    <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                        <div>
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/40">
                            {phase.timeframe}
                          </span>
                          <h4 className="text-xs font-bold text-slate-100 mt-1">{phase.phase}</h4>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-800/40">
                          Target: {phase.target}
                        </span>
                      </div>

                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-400">
                        {phase.actions?.map((act, aIdx) => (
                          <li key={aIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Turnaround Recovery Model */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  Financial Turnaround Trajectory Model (From Deficit to +₹18.4 Cr EBITDA)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
                  <div className="bg-slate-900 p-3 rounded-lg border border-rose-900/40">
                    <p className="text-rose-400 font-bold uppercase text-[10px]">Historical Baseline</p>
                    <p className="text-slate-200 mt-1">Revenue: {report?.turnaround_financial_model?.baseline?.annual_revenue}</p>
                    <p className="text-slate-200">Gross Margin: {report?.turnaround_financial_model?.baseline?.gross_margin}</p>
                    <p className="text-slate-200">OpEx Ratio: {report?.turnaround_financial_model?.baseline?.opex}</p>
                    <p className="text-rose-400 font-extrabold mt-1">Net: {report?.turnaround_financial_model?.baseline?.net_profit}</p>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-lg border border-amber-900/40">
                    <p className="text-amber-400 font-bold uppercase text-[10px]">Year 1 Recovery (2026)</p>
                    <p className="text-slate-200 mt-1">Revenue: {report?.turnaround_financial_model?.year_1_recovery?.annual_revenue}</p>
                    <p className="text-slate-200">Gross Margin: {report?.turnaround_financial_model?.year_1_recovery?.gross_margin}</p>
                    <p className="text-slate-200">OpEx Ratio: {report?.turnaround_financial_model?.year_1_recovery?.opex}</p>
                    <p className="text-amber-400 font-extrabold mt-1">Net: {report?.turnaround_financial_model?.year_1_recovery?.net_profit}</p>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-lg border border-indigo-900/40">
                    <p className="text-indigo-400 font-bold uppercase text-[10px]">Year 2 Profit Turn (2027)</p>
                    <p className="text-slate-200 mt-1">Revenue: {report?.turnaround_financial_model?.year_2_sustainable_profit?.annual_revenue}</p>
                    <p className="text-slate-200">Gross Margin: {report?.turnaround_financial_model?.year_2_sustainable_profit?.gross_margin}</p>
                    <p className="text-slate-200">OpEx Ratio: {report?.turnaround_financial_model?.year_2_sustainable_profit?.opex}</p>
                    <p className="text-emerald-400 font-extrabold mt-1">Net: {report?.turnaround_financial_model?.year_2_sustainable_profit?.net_profit}</p>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-lg border border-emerald-900/40">
                    <p className="text-emerald-400 font-bold uppercase text-[10px]">Year 5 Terminal (2030)</p>
                    <p className="text-slate-200 mt-1">Revenue: {report?.turnaround_financial_model?.year_5_terminal_target?.annual_revenue}</p>
                    <p className="text-slate-200">Gross Margin: {report?.turnaround_financial_model?.year_5_terminal_target?.gross_margin}</p>
                    <p className="text-slate-200">OpEx Ratio: {report?.turnaround_financial_model?.year_5_terminal_target?.opex}</p>
                    <p className="text-emerald-400 font-extrabold mt-1">Net: {report?.turnaround_financial_model?.year_5_terminal_target?.net_profit}</p>
                  </div>
                </div>
              </div>

              {/* Governance & Signatories */}
              <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
                <div>
                  <span className="font-semibold text-slate-300">Governance Status: </span>
                  <span className="text-emerald-400 font-bold">{report?.governance?.approval_status}</span>
                  <span className="ml-2">• {report?.governance?.sign_off_date}</span>
                </div>
                <div className="flex items-center gap-3">
                  {report?.governance?.signatories?.map((sig, idx) => (
                    <span key={idx} className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-[10px]">
                      {sig.role}: <strong className="text-emerald-400">{sig.status}</strong>
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
