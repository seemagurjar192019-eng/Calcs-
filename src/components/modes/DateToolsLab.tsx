import React, { useState } from 'react';
import { DateCalculatorEngine } from '../../engine/dates';

export const DateToolsLab: React.FC = () => {
  const [tab, setTab] = useState<'diff' | 'add' | 'age'>('diff');

  // Difference state
  const [date1, setDate1] = useState(new Date().toISOString().split('T')[0]);
  const [date2, setDate2] = useState(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);

  // Add/Sub state
  const [baseDate, setBaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [addDays, setAddDays] = useState('45');

  // Age state
  const [birthDate, setBirthDate] = useState('2000-01-01');

  // Calculations
  const diffResult = DateCalculatorEngine.daysBetween(new Date(date1), new Date(date2));
  const addedDate = DateCalculatorEngine.addTime(new Date(baseDate), parseInt(addDays) || 0);
  const ageResult = DateCalculatorEngine.calculateAge(new Date(birthDate));
  const birthWeekday = DateCalculatorEngine.getWeekday(new Date(birthDate));

  return (
    <div className="flex flex-col gap-4">
      {/* Sub Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl mat-1 border border-white/10 text-xs">
        <button
          onClick={() => setTab('diff')}
          className={`flex-1 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
            tab === 'diff' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
          }`}
        >
          Date Span Difference
        </button>
        <button
          onClick={() => setTab('add')}
          className={`flex-1 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
            tab === 'add' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
          }`}
        >
          Add / Subtract Time
        </button>
        <button
          onClick={() => setTab('age')}
          className={`flex-1 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
            tab === 'age' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
          }`}
        >
          Age & Milestone
        </button>
      </div>

      {/* Difference Tab */}
      {tab === 'diff' && (
        <div className="p-4 rounded-2xl mat-2 border border-white/10 flex flex-col gap-4">
          <span className="text-xs font-mono-tech font-bold text-cyan-400">
            Duration Between Dates
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Start Date</label>
              <input
                type="date"
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
                className="bg-slate-900/90 text-sm font-mono-tech text-white p-2.5 rounded-xl border border-white/10 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">End Date</label>
              <input
                type="date"
                value={date2}
                onChange={(e) => setDate2(e.target.value)}
                className="bg-slate-900/90 text-sm font-mono-tech text-white p-2.5 rounded-xl border border-white/10 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col items-center">
              <span className="text-[11px] text-slate-400">Calendar Days</span>
              <span className="text-xl font-mono-tech font-bold text-cyan-300">{diffResult.days}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col items-center">
              <span className="text-[11px] text-slate-400">Full Weeks</span>
              <span className="text-xl font-mono-tech font-bold text-white">{diffResult.weeks}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col items-center">
              <span className="text-[11px] text-slate-400">Business Days</span>
              <span className="text-xl font-mono-tech font-bold text-emerald-400">{diffResult.businessDays}</span>
            </div>
          </div>
        </div>
      )}

      {/* Add / Sub Tab */}
      {tab === 'add' && (
        <div className="p-4 rounded-2xl mat-2 border border-white/10 flex flex-col gap-4">
          <span className="text-xs font-mono-tech font-bold text-cyan-400">
            Project Date into the Future or Past
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Starting Date</label>
              <input
                type="date"
                value={baseDate}
                onChange={(e) => setBaseDate(e.target.value)}
                className="bg-slate-900/90 text-sm font-mono-tech text-white p-2.5 rounded-xl border border-white/10 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Days to Add (or negative to subtract)</label>
              <input
                type="number"
                value={addDays}
                onChange={(e) => setAddDays(e.target.value)}
                className="bg-slate-900/90 text-sm font-mono-tech text-white p-2.5 rounded-xl border border-white/10 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 flex flex-col items-center gap-1">
            <span className="text-xs text-slate-400">Calculated Result Date:</span>
            <span className="text-xl font-mono-tech font-bold text-cyan-300">
              {addedDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
      )}

      {/* Age Tab */}
      {tab === 'age' && (
        <div className="p-4 rounded-2xl mat-2 border border-white/10 flex flex-col gap-4">
          <span className="text-xs font-mono-tech font-bold text-cyan-400">
            Precise Chronological Age & Weekday
          </span>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">Date of Birth</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="bg-slate-900/90 text-sm font-mono-tech text-white p-2.5 rounded-xl border border-white/10 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col items-center">
              <span className="text-[11px] text-slate-400">Years</span>
              <span className="text-xl font-mono-tech font-bold text-cyan-300">{ageResult.years}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col items-center">
              <span className="text-[11px] text-slate-400">Months</span>
              <span className="text-xl font-mono-tech font-bold text-white">{ageResult.months}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col items-center">
              <span className="text-[11px] text-slate-400">Days</span>
              <span className="text-xl font-mono-tech font-bold text-white">{ageResult.days}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col items-center">
              <span className="text-[11px] text-slate-400">Day of Week</span>
              <span className="text-sm font-mono-tech font-bold text-emerald-400">{birthWeekday}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
