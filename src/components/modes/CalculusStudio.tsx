import React, { useState } from 'react';
import { CalculusEngine } from '../../engine/calculus';

export const CalculusStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'integral' | 'derivative' | 'limit'>('integral');

  // Integral state
  const [integralExpr, setIntegralExpr] = useState('x^2');
  const [lowerBound, setLowerBound] = useState('0');
  const [upperBound, setUpperBound] = useState('3');
  const [integralResult, setIntegralResult] = useState<{ simpson: number; trapezoid: number } | null>(null);

  // Derivative state
  const [derivExpr, setDerivExpr] = useState('sin(x)');
  const [pointX, setPointX] = useState('1.570796'); // pi/2
  const [derivResult, setDerivResult] = useState<{ slope: number; tangentEq: string } | null>(null);

  // Limit state
  const [limitExpr, setLimitExpr] = useState('sin(x) / x');
  const [targetX, setTargetX] = useState('0');
  const [limitResult, setLimitResult] = useState<any | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const calculateIntegral = () => {
    setErrorMsg(null);
    try {
      const a = parseFloat(lowerBound);
      const b = parseFloat(upperBound);
      const s = CalculusEngine.simpsonsRule(integralExpr, a, b);
      const t = CalculusEngine.trapezoidalRule(integralExpr, a, b);
      setIntegralResult({ simpson: s, trapezoid: t });
    } catch (err: any) {
      setErrorMsg(err.message || 'Error evaluating integral');
    }
  };

  const calculateDerivative = () => {
    setErrorMsg(null);
    try {
      const a = parseFloat(pointX);
      const slope = CalculusEngine.derivative(derivExpr, a);
      const { equation } = CalculusEngine.tangentLine(derivExpr, a);
      setDerivResult({ slope, tangentEq: equation });
    } catch (err: any) {
      setErrorMsg(err.message || 'Error evaluating derivative');
    }
  };

  const calculateLimit = () => {
    setErrorMsg(null);
    try {
      const a = parseFloat(targetX);
      const res = CalculusEngine.analyzeLimit(limitExpr, a);
      setLimitResult(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error analyzing limit');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Sub Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl mat-1 border border-white/10 text-xs">
        <button
          onClick={() => { setActiveTab('integral'); setErrorMsg(null); }}
          className={`flex-1 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
            activeTab === 'integral'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Definite Integral (∫)
        </button>
        <button
          onClick={() => { setActiveTab('derivative'); setErrorMsg(null); }}
          className={`flex-1 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
            activeTab === 'derivative'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Derivative & Tangent (d/dx)
        </button>
        <button
          onClick={() => { setActiveTab('limit'); setErrorMsg(null); }}
          className={`flex-1 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
            activeTab === 'limit'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Limit & Continuity (lim)
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs font-mono-tech">
          {errorMsg}
        </div>
      )}

      {/* Integral Tab */}
      {activeTab === 'integral' && (
        <div className="p-4 rounded-2xl mat-2 border border-white/10 flex flex-col gap-3">
          <span className="text-xs font-mono-tech font-bold text-cyan-400">
            Definite Numerical Integral: ∫[a, b] f(x) dx
          </span>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full bg-slate-900/90 px-3 py-2 rounded-xl border border-white/10 flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono-tech">f(x) =</span>
              <input
                type="text"
                value={integralExpr}
                onChange={(e) => setIntegralExpr(e.target.value)}
                className="bg-transparent text-sm text-white font-mono-tech focus:outline-none w-full"
                placeholder="e.g. x^2 or sin(x)"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="number"
                value={lowerBound}
                onChange={(e) => setLowerBound(e.target.value)}
                placeholder="a"
                className="w-20 bg-slate-900/90 px-3 py-2 rounded-xl border border-white/10 text-sm font-mono-tech text-center text-white focus:outline-none"
              />
              <span className="text-slate-500 font-mono-tech">to</span>
              <input
                type="number"
                value={upperBound}
                onChange={(e) => setUpperBound(e.target.value)}
                placeholder="b"
                className="w-20 bg-slate-900/90 px-3 py-2 rounded-xl border border-white/10 text-sm font-mono-tech text-center text-white focus:outline-none"
              />
              <button
                onClick={calculateIntegral}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                Evaluate
              </button>
            </div>
          </div>

          {integralResult && (
            <div className="mt-2 p-3 bg-slate-950/80 rounded-xl border border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm font-mono-tech">
                <span className="text-slate-400">Simpson's 1/3 Rule (high precision):</span>
                <span className="font-bold text-cyan-300 text-lg">{integralResult.simpson}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono-tech text-slate-400 pt-1 border-t border-white/5">
                <span>Trapezoidal Rule:</span>
                <span>{integralResult.trapezoid}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Derivative Tab */}
      {activeTab === 'derivative' && (
        <div className="p-4 rounded-2xl mat-2 border border-white/10 flex flex-col gap-3">
          <span className="text-xs font-mono-tech font-bold text-cyan-400">
            Numerical Derivative & Tangent Line at Point x = a
          </span>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full bg-slate-900/90 px-3 py-2 rounded-xl border border-white/10 flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono-tech">f(x) =</span>
              <input
                type="text"
                value={derivExpr}
                onChange={(e) => setDerivExpr(e.target.value)}
                className="bg-transparent text-sm text-white font-mono-tech focus:outline-none w-full"
                placeholder="e.g. sin(x) or x^3"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 font-mono-tech">at x =</span>
              <input
                type="text"
                value={pointX}
                onChange={(e) => setPointX(e.target.value)}
                className="w-24 bg-slate-900/90 px-3 py-2 rounded-xl border border-white/10 text-sm font-mono-tech text-center text-white focus:outline-none"
              />
              <button
                onClick={calculateDerivative}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                Compute
              </button>
            </div>
          </div>

          {derivResult && (
            <div className="mt-2 p-3 bg-slate-950/80 rounded-xl border border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm font-mono-tech">
                <span className="text-slate-400">Derivative Slope f'(a):</span>
                <span className="font-bold text-cyan-300 text-lg">{derivResult.slope}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono-tech text-slate-400 pt-1 border-t border-white/5">
                <span>Tangent Line Equation:</span>
                <span className="text-emerald-400 font-semibold">{derivResult.tangentEq}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Limit Tab */}
      {activeTab === 'limit' && (
        <div className="p-4 rounded-2xl mat-2 border border-white/10 flex flex-col gap-3">
          <span className="text-xs font-mono-tech font-bold text-cyan-400">
            Limit & Continuity Analyzer: lim[x → a] f(x)
          </span>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full bg-slate-900/90 px-3 py-2 rounded-xl border border-white/10 flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono-tech">f(x) =</span>
              <input
                type="text"
                value={limitExpr}
                onChange={(e) => setLimitExpr(e.target.value)}
                className="bg-transparent text-sm text-white font-mono-tech focus:outline-none w-full"
                placeholder="e.g. sin(x) / x"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 font-mono-tech">x →</span>
              <input
                type="text"
                value={targetX}
                onChange={(e) => setTargetX(e.target.value)}
                className="w-20 bg-slate-900/90 px-3 py-2 rounded-xl border border-white/10 text-sm font-mono-tech text-center text-white focus:outline-none"
              />
              <button
                onClick={calculateLimit}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                Analyze
              </button>
            </div>
          </div>

          {limitResult && (
            <div className="mt-2 p-3 bg-slate-950/80 rounded-xl border border-white/10 flex flex-col gap-2 text-xs font-mono-tech">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Estimated Two-Sided Limit:</span>
                <span className="font-bold text-cyan-300 text-base">
                  {limitResult.isContinuous ? limitResult.leftLimit : 'Does not exist / Discontinuous'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Left Limit (x → a⁻): {limitResult.leftLimit} | Right Limit (x → a⁺): {limitResult.rightLimit}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
