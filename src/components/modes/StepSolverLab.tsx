import React, { useState } from 'react';
import { StepSolver, SolutionStep } from '../../engine/stepSolver';

export const StepSolverLab: React.FC = () => {
  const [eqType, setEqType] = useState<'linear' | 'quadratic'>('linear');

  // Linear: ax + b = c
  const [linA, setLinA] = useState('2');
  const [linB, setLinB] = useState('5');
  const [linC, setLinC] = useState('17');

  // Quadratic: ax^2 + bx + c = 0
  const [quadA, setQuadA] = useState('1');
  const [quadB, setQuadB] = useState('-5');
  const [quadC, setQuadC] = useState('6');

  const [steps, setSteps] = useState<SolutionStep[]>([]);
  const [finalResult, setFinalResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const solve = () => {
    setErrorMsg(null);
    setSteps([]);
    setFinalResult(null);

    try {
      if (eqType === 'linear') {
        const a = parseFloat(linA);
        const b = parseFloat(linB);
        const c = parseFloat(linC);
        if (a === 0) throw new Error('Coefficient "a" cannot be 0 in linear equation');
        const res = StepSolver.solveLinear(a, b, c);
        setSteps(res.steps);
        setFinalResult(`x = ${res.solution}`);
      } else {
        const a = parseFloat(quadA);
        const b = parseFloat(quadB);
        const c = parseFloat(quadC);
        if (a === 0) throw new Error('Coefficient "a" cannot be 0 in quadratic equation');
        const res = StepSolver.solveQuadratic(a, b, c);
        setSteps(res.steps);
        setFinalResult(
          res.roots.length > 0 ? `Roots: ${res.roots.join(', ')}` : 'No real roots (discriminant < 0)'
        );
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error solving equation');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Type Selector */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl mat-1 border border-white/10 text-xs">
        <button
          onClick={() => { setEqType('linear'); setSteps([]); }}
          className={`flex-1 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
            eqType === 'linear'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Linear Equation (ax + b = c)
        </button>
        <button
          onClick={() => { setEqType('quadratic'); setSteps([]); }}
          className={`flex-1 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
            eqType === 'quadratic'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Quadratic Equation (ax² + bx + c = 0)
        </button>
      </div>

      {/* Input Parameters */}
      <div className="p-4 rounded-2xl mat-2 border border-white/10 flex flex-col gap-3">
        <span className="text-xs font-mono-tech font-bold text-cyan-400">
          {eqType === 'linear' ? 'Configure: ax + b = c' : 'Configure: ax² + bx + c = 0'}
        </span>

        {eqType === 'linear' ? (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={linA}
                onChange={(e) => setLinA(e.target.value)}
                className="w-16 bg-slate-900/90 text-center py-2 rounded-lg border border-white/10 text-sm font-mono-tech text-white"
              />
              <span className="font-mono-tech text-slate-300">x +</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={linB}
                onChange={(e) => setLinB(e.target.value)}
                className="w-16 bg-slate-900/90 text-center py-2 rounded-lg border border-white/10 text-sm font-mono-tech text-white"
              />
              <span className="font-mono-tech text-slate-300">=</span>
            </div>
            <input
              type="number"
              value={linC}
              onChange={(e) => setLinC(e.target.value)}
              className="w-16 bg-slate-900/90 text-center py-2 rounded-lg border border-white/10 text-sm font-mono-tech text-white"
            />
            <button
              onClick={solve}
              className="ml-auto px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs cursor-pointer shadow-md"
            >
              Solve Step-by-Step
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={quadA}
                onChange={(e) => setQuadA(e.target.value)}
                className="w-16 bg-slate-900/90 text-center py-2 rounded-lg border border-white/10 text-sm font-mono-tech text-white"
              />
              <span className="font-mono-tech text-slate-300">x² +</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={quadB}
                onChange={(e) => setQuadB(e.target.value)}
                className="w-16 bg-slate-900/90 text-center py-2 rounded-lg border border-white/10 text-sm font-mono-tech text-white"
              />
              <span className="font-mono-tech text-slate-300">x +</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={quadC}
                onChange={(e) => setQuadC(e.target.value)}
                className="w-16 bg-slate-900/90 text-center py-2 rounded-lg border border-white/10 text-sm font-mono-tech text-white"
              />
              <span className="font-mono-tech text-slate-300">= 0</span>
            </div>
            <button
              onClick={solve}
              className="ml-auto px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs cursor-pointer shadow-md"
            >
              Solve Step-by-Step
            </button>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs font-mono-tech">
          {errorMsg}
        </div>
      )}

      {/* Step by Step Derivation Cards */}
      {steps.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-mono-tech font-bold text-slate-400">
            Algorithmic Transformation Sequence:
          </span>

          <div className="flex flex-col gap-2">
            {steps.map((s) => (
              <div
                key={s.stepNumber}
                className="p-3.5 rounded-xl mat-1 border border-white/10 flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center font-mono-tech text-xs font-bold shrink-0 mt-0.5">
                  {s.stepNumber}
                </span>
                <div className="flex flex-col gap-1">
                  <span className="font-mono-tech font-bold text-white text-sm sm:text-base">
                    {s.expression}
                  </span>
                  <span className="text-xs text-slate-400">{s.explanation}</span>
                </div>
              </div>
            ))}
          </div>

          {finalResult && (
            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-300">Final Evaluated Result:</span>
              <span className="font-mono-tech font-bold text-white text-lg">{finalResult}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
