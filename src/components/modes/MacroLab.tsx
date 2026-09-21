import React, { useState } from 'react';
import { MacroEngine, MacroExecutionResult } from '../../engine/macros';
import { Play, Plus, Trash2 } from 'lucide-react';

export const MacroLab: React.FC = () => {
  const [macroName, setMacroName] = useState('Compound Growth & Fee');
  const [inputVal, setInputVal] = useState('5000');
  const [steps, setSteps] = useState<string[]>([
    'val * 1.08',
    'val - 50',
    'val * 1.05',
  ]);
  const [newStep, setNewStep] = useState('');
  const [execResult, setExecResult] = useState<MacroExecutionResult | null>(null);

  const addStep = () => {
    if (!newStep.trim()) return;
    setSteps([...steps, newStep.trim()]);
    setNewStep('');
  };

  const removeStep = (idx: number) => {
    setSteps(steps.filter((_, i) => i !== idx));
  };

  const runMacro = () => {
    const startVal = parseFloat(inputVal) || 0;
    const res = MacroEngine.executeMacro(steps, startVal);
    setExecResult(res);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 rounded-2xl mat-2 border border-white/10 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono-tech font-bold text-cyan-400">
            Sandboxed Multi-Step Macro Execution Engine
          </span>
          <span className="text-[11px] text-slate-500 font-mono-tech">Variable: val</span>
        </div>

        {/* Starting Input */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 whitespace-nowrap">Initial Input val =</span>
          <input
            type="number"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-36 bg-slate-900/90 text-sm font-mono-tech text-white p-2 rounded-xl border border-white/10 focus:outline-none"
          />
        </div>

        {/* Steps List */}
        <div className="flex flex-col gap-2">
          <span className="text-xs text-slate-400 font-semibold">Sequential Macro Steps:</span>
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2.5 bg-slate-900/80 rounded-xl border border-white/5"
            >
              <span className="text-xs font-mono-tech text-cyan-400 font-bold w-6">
                #{idx + 1}
              </span>
              <span className="text-sm font-mono-tech text-white flex-1">{step}</span>
              <button
                onClick={() => removeStep(idx)}
                className="p-1 rounded text-slate-500 hover:text-rose-400 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Add Step */}
          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              placeholder="e.g. val * 1.15 or val - 20"
              className="flex-1 bg-slate-900/90 text-sm font-mono-tech text-white p-2 rounded-xl border border-white/10 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') addStep();
              }}
            />
            <button
              onClick={addStep}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-white/10 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Run Macro Button */}
        <button
          onClick={runMacro}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-xs text-white cursor-pointer shadow-md"
        >
          <Play className="w-4 h-4" />
          <span>Execute Sequential Macro Pipeline</span>
        </button>
      </div>

      {/* Execution Results */}
      {execResult && (
        <div className="p-4 rounded-2xl mat-1 border border-white/10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Pipeline Step Audit:</span>
            <span className="text-xs font-mono-tech font-bold text-cyan-400">
              Final Output = {execResult.finalValue}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {execResult.stepOutputs.map((s: any) => (
              <div
                key={s.stepIndex}
                className="p-3 bg-slate-900/80 rounded-xl border border-white/5 flex items-center justify-between text-xs font-mono-tech"
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Step {s.stepIndex + 1}:</span>
                  <span className="text-white">{s.expression}</span>
                </div>
                <span className="font-bold text-emerald-400 text-sm">→ {s.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
