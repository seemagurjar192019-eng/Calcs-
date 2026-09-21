import React, { useState } from 'react';
import { Sparkles, Brain, Zap, Send, Loader2, BookOpen, AlertCircle, ArrowUpRight } from 'lucide-react';
import { GeminiSolveResponse } from '../../types';

interface AIMathTutorProps {
  currentExpression?: string;
  onApplyResult?: (res: string) => void;
}

export const AIMathTutor: React.FC<AIMathTutorProps> = ({
  currentExpression = '',
  onApplyResult,
}) => {
  const [query, setQuery] = useState(currentExpression ? `Solve and explain: ${currentExpression}` : '');
  const [modelMode, setModelMode] = useState<'low-latency' | 'high-thinking'>('low-latency');
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState<GeminiSolveResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSolve = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);
    setSolution(null);

    try {
      const res = await fetch('/api/gemini/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem: query,
          mode: modelMode,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch AI solution');
      }

      setSolution(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with AI engine');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* AI Header & Model Selector */}
      <div className="p-4 rounded-2xl mat-2 border border-white/10 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Gemini Mathematical Reasoning</h3>
              <p className="text-[11px] text-slate-400">Step-by-step calculus, algebra, and physics derivations</p>
            </div>
          </div>

          {/* Model Toggle: Low Latency vs High Thinking */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setModelMode('low-latency')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                modelMode === 'low-latency'
                  ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Low Latency (3.1 Flash-Lite)</span>
            </button>
            <button
              onClick={() => setModelMode('high-thinking')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                modelMode === 'high-thinking'
                  ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Brain className="w-3.5 h-3.5 text-purple-400" />
              <span>High Thinking (3.1 Pro)</span>
            </button>
          </div>
        </div>

        {/* Input Query */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Derive the integral of x*sin(x) dx using integration by parts"
              className="flex-1 bg-slate-900/90 text-sm text-white p-3 rounded-xl border border-white/10 focus:border-sky-500 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSolve();
              }}
            />
            <button
              disabled={isLoading || !query.trim()}
              onClick={handleSolve}
              className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                isLoading || !query.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white cursor-pointer shadow-md active:scale-95'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Ask AI</span>
                </>
              )}
            </button>
          </div>

          {/* Preset Prompts */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-400">
            <span className="text-slate-500 whitespace-nowrap">Examples:</span>
            {[
              '∫ x*sin(x) dx',
              'Roots of x^3 - 6x^2 + 11x - 6 = 0',
              'Eigenvalues of [[2,1],[1,2]]',
              'Half-life decay after 5 periods',
            ].map((ex) => (
              <button
                key={ex}
                onClick={() => setQuery(`Solve step by step: ${ex}`)}
                className="px-2 py-0.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 whitespace-nowrap cursor-pointer"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1 text-xs">
            <span className="font-bold text-rose-300">AI Request Error</span>
            <p className="text-slate-300">{errorMsg}</p>
            {errorMsg.includes('GEMINI_API_KEY') && (
              <p className="text-slate-400 mt-1">
                Tip: Configure your Gemini API Key in your project settings to enable AI features.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Solution Presentation */}
      {solution && (
        <div className="flex flex-col gap-3">
          {/* Header summary */}
          <div className="p-4 rounded-2xl mat-2 border border-white/10 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-tech font-bold text-sky-400">
                Model: {solution.modelUsed}
              </span>
              {solution.finalAnswer && onApplyResult && (
                <button
                  onClick={() => onApplyResult(solution.finalAnswer!)}
                  className="flex items-center gap-1 text-xs text-sky-300 hover:text-white bg-sky-950/50 hover:bg-sky-900/60 px-2.5 py-1 rounded-lg border border-sky-500/30 cursor-pointer"
                >
                  <span>Load Answer</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Final Answer Banner */}
            {solution.finalAnswer && (
              <div className="p-3 bg-slate-900/90 rounded-xl border border-sky-500/30 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">Final Evaluated Result:</span>
                <span className="font-mono-tech font-bold text-white text-base sm:text-lg">
                  {solution.finalAnswer}
                </span>
              </div>
            )}
          </div>

          {/* Derivation Steps */}
          {solution.steps && solution.steps.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                <span>Step-by-Step Derivation:</span>
              </span>

              {solution.steps.map((step: any) => (
                <div
                  key={step.stepNumber}
                  className="p-3.5 rounded-xl mat-1 border border-white/10 flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center justify-center font-mono-tech text-xs font-bold shrink-0 mt-0.5">
                    {step.stepNumber}
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="font-mono-tech font-bold text-white text-sm">
                      {step.expression}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">{step.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Explanations & Notes */}
          {solution.explanation && (
            <div className="p-4 rounded-xl mat-1 border border-white/10 text-xs text-slate-300 leading-relaxed flex flex-col gap-1">
              <span className="font-bold text-slate-400">Mathematical Insight:</span>
              <p>{solution.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
