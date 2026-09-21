import React, { useState } from 'react';
import { FinanceEngine, AmortizationRow } from '../../engine/finance';

export const FinanceLab: React.FC = () => {
  const [tab, setTab] = useState<'emi' | 'compound' | 'sip' | 'tip'>('emi');

  // EMI state
  const [principal, setPrincipal] = useState('50000');
  const [interestRate, setInterestRate] = useState('7.5');
  const [tenureMonths, setTenureMonths] = useState('36');
  const [emiResult, setEmiResult] = useState<{
    emi: number;
    totalInterest: number;
    totalPayment: number;
    schedule: AmortizationRow[];
  } | null>(null);

  // Compound state
  const [cPrincipal, setCPrincipal] = useState('10000');
  const [cRate, setCRate] = useState('8');
  const [cYears, setCYears] = useState('5');
  const [cResult, setCResult] = useState<{ finalAmount: number; interestEarned: number } | null>(null);

  // SIP state
  const [sipMonthly, setSipMonthly] = useState('500');
  const [sipRate, setSipRate] = useState('12');
  const [sipYears, setSipYears] = useState('10');
  const [sipResult, setSipResult] = useState<{ invested: number; returns: number; maturity: number } | null>(null);

  // Tip state
  const [bill, setBill] = useState('120');
  const [tipPct, setTipPct] = useState('18');
  const [people, setPeople] = useState('3');
  const [tipResult, setTipResult] = useState<{ tipAmount: number; totalAmount: number; perPerson: number } | null>(null);

  const calculateEMI = () => {
    const p = parseFloat(principal) || 0;
    const r = parseFloat(interestRate) || 0;
    const m = parseInt(tenureMonths) || 1;
    setEmiResult(FinanceEngine.calculateEMI(p, r, m));
  };

  const calculateCompound = () => {
    const p = parseFloat(cPrincipal) || 0;
    const r = parseFloat(cRate) || 0;
    const y = parseFloat(cYears) || 0;
    setCResult(FinanceEngine.compoundInterest(p, r, y));
  };

  const calculateSIP = () => {
    const m = parseFloat(sipMonthly) || 0;
    const r = parseFloat(sipRate) || 0;
    const y = parseFloat(sipYears) || 0;
    setSipResult(FinanceEngine.calculateSIP(m, r, y));
  };

  const calculateTip = () => {
    const b = parseFloat(bill) || 0;
    const t = parseFloat(tipPct) || 0;
    const n = parseInt(people) || 1;
    setTipResult(FinanceEngine.calculateTip(b, t, n));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Sub Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl mat-1 border border-white/10 text-xs">
        <button
          onClick={() => setTab('emi')}
          className={`flex-1 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
            tab === 'emi' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
          }`}
        >
          Loan EMI
        </button>
        <button
          onClick={() => setTab('compound')}
          className={`flex-1 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
            tab === 'compound' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
          }`}
        >
          Compound Interest
        </button>
        <button
          onClick={() => setTab('sip')}
          className={`flex-1 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
            tab === 'sip' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
          }`}
        >
          SIP Planner
        </button>
        <button
          onClick={() => setTab('tip')}
          className={`flex-1 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
            tab === 'tip' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
          }`}
        >
          Tip & Split
        </button>
      </div>

      {/* EMI Section */}
      {tab === 'emi' && (
        <div className="p-4 rounded-2xl mat-2 border border-white/10 flex flex-col gap-4">
          <span className="text-xs font-mono-tech font-bold text-cyan-400">Loan & Mortgage EMI Calculator</span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Loan Amount ($)</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="bg-slate-900/90 text-sm font-mono-tech text-white p-2.5 rounded-xl border border-white/10 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Annual Interest Rate (%)</label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="bg-slate-900/90 text-sm font-mono-tech text-white p-2.5 rounded-xl border border-white/10 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Tenure (Months)</label>
              <input
                type="number"
                value={tenureMonths}
                onChange={(e) => setTenureMonths(e.target.value)}
                className="bg-slate-900/90 text-sm font-mono-tech text-white p-2.5 rounded-xl border border-white/10 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={calculateEMI}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-xs text-white cursor-pointer shadow-md"
          >
            Calculate Loan Payment
          </button>

          {emiResult && (
            <div className="flex flex-col gap-3 mt-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col items-center">
                  <span className="text-[11px] text-slate-400">Monthly EMI</span>
                  <span className="text-lg font-mono-tech font-bold text-cyan-300">${emiResult.emi}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col items-center">
                  <span className="text-[11px] text-slate-400">Total Interest</span>
                  <span className="text-lg font-mono-tech font-bold text-amber-300">${emiResult.totalInterest}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col items-center">
                  <span className="text-[11px] text-slate-400">Total Payment</span>
                  <span className="text-lg font-mono-tech font-bold text-white">${emiResult.totalPayment}</span>
                </div>
              </div>

              {/* Amortization Schedule snippet */}
              <div className="flex flex-col gap-1 mt-2">
                <span className="text-xs text-slate-400 font-semibold">Amortization Schedule (First 6 months):</span>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono-tech text-slate-300 text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-500">
                        <th className="py-1">Mo</th>
                        <th className="py-1">Payment</th>
                        <th className="py-1">Principal</th>
                        <th className="py-1">Interest</th>
                        <th className="py-1">Remaining</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emiResult.schedule.slice(0, 6).map((row) => (
                        <tr key={row.month} className="border-b border-white/5">
                          <td className="py-1">{row.month}</td>
                          <td className="py-1">${row.payment}</td>
                          <td className="py-1 text-emerald-400">${row.principal}</td>
                          <td className="py-1 text-amber-400">${row.interest}</td>
                          <td className="py-1">${row.balance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Compound Interest */}
      {tab === 'compound' && (
        <div className="p-4 rounded-2xl mat-2 border border-white/10 flex flex-col gap-4">
          <span className="text-xs font-mono-tech font-bold text-cyan-400">Compound Interest Growth</span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Initial Principal ($)</label>
              <input
                type="number"
                value={cPrincipal}
                onChange={(e) => setCPrincipal(e.target.value)}
                className="bg-slate-900/90 text-sm font-mono-tech text-white p-2.5 rounded-xl border border-white/10 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Annual Return / Interest (%)</label>
              <input
                type="number"
                value={cRate}
                onChange={(e) => setCRate(e.target.value)}
                className="bg-slate-900/90 text-sm font-mono-tech text-white p-2.5 rounded-xl border border-white/10 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Time Horizon (Years)</label>
              <input
                type="number"
                value={cYears}
                onChange={(e) => setCYears(e.target.value)}
                className="bg-slate-900/90 text-sm font-mono-tech text-white p-2.5 rounded-xl border border-white/10 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={calculateCompound}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-xs text-white cursor-pointer shadow-md"
          >
            Calculate Growth
          </button>

          {cResult && (
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col items-center">
                <span className="text-xs text-slate-400">Total Future Balance</span>
                <span className="text-xl font-mono-tech font-bold text-emerald-400">${cResult.finalAmount}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col items-center">
                <span className="text-xs text-slate-400">Interest Earned</span>
                <span className="text-xl font-mono-tech font-bold text-cyan-300">${cResult.interestEarned}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SIP Planner */}
      {tab === 'sip' && (
        <div className="p-4 rounded-2xl mat-2 border border-white/10 flex flex-col gap-4">
          <span className="text-xs font-mono-tech font-bold text-cyan-400">Systematic Investment Plan (SIP)</span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Monthly Contribution ($)</label>
              <input
                type="number"
                value={sipMonthly}
                onChange={(e) => setSipMonthly(e.target.value)}
                className="bg-slate-900/90 text-sm font-mono-tech text-white p-2.5 rounded-xl border border-white/10 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Expected Annual Return (%)</label>
              <input
                type="number"
                value={sipRate}
                onChange={(e) => setSipRate(e.target.value)}
                className="bg-slate-900/90 text-sm font-mono-tech text-white p-2.5 rounded-xl border border-white/10 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Tenure (Years)</label>
              <input
                type="number"
                value={sipYears}
                onChange={(e) => setSipYears(e.target.value)}
                className="bg-slate-900/90 text-sm font-mono-tech text-white p-2.5 rounded-xl border border-white/10 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={calculateSIP}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-xs text-white cursor-pointer shadow-md"
          >
            Calculate SIP Returns
          </button>

          {sipResult && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col items-center">
                <span className="text-[11px] text-slate-400">Total Invested</span>
                <span className="text-base font-mono-tech font-bold text-white">${sipResult.invested}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col items-center">
                <span className="text-[11px] text-slate-400">Estimated Returns</span>
                <span className="text-base font-mono-tech font-bold text-cyan-300">${sipResult.returns}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col items-center">
                <span className="text-[11px] text-slate-400">Maturity Wealth</span>
                <span className="text-base font-mono-tech font-bold text-emerald-400">${sipResult.maturity}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tip & Split */}
      {tab === 'tip' && (
        <div className="p-4 rounded-2xl mat-2 border border-white/10 flex flex-col gap-4">
          <span className="text-xs font-mono-tech font-bold text-cyan-400">Tip & Bill Split Calculator</span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Bill Total ($)</label>
              <input
                type="number"
                value={bill}
                onChange={(e) => setBill(e.target.value)}
                className="bg-slate-900/90 text-sm font-mono-tech text-white p-2.5 rounded-xl border border-white/10 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Tip Percentage (%)</label>
              <input
                type="number"
                value={tipPct}
                onChange={(e) => setTipPct(e.target.value)}
                className="bg-slate-900/90 text-sm font-mono-tech text-white p-2.5 rounded-xl border border-white/10 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Number of People</label>
              <input
                type="number"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                className="bg-slate-900/90 text-sm font-mono-tech text-white p-2.5 rounded-xl border border-white/10 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={calculateTip}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-xs text-white cursor-pointer shadow-md"
          >
            Calculate Split
          </button>

          {tipResult && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col items-center">
                <span className="text-[11px] text-slate-400">Tip Total</span>
                <span className="text-base font-mono-tech font-bold text-cyan-300">${tipResult.tipAmount}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col items-center">
                <span className="text-[11px] text-slate-400">Grand Total</span>
                <span className="text-base font-mono-tech font-bold text-white">${tipResult.totalAmount}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col items-center">
                <span className="text-[11px] text-slate-400">Each Person Pays</span>
                <span className="text-base font-mono-tech font-bold text-emerald-400">${tipResult.perPerson}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
