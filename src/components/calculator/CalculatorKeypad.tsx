import React, { useState } from 'react';
import { Delete, RotateCcw } from 'lucide-react';

interface CalculatorKeypadProps {
  onInput: (char: string) => void;
  onClear: () => void;
  onAllClear: () => void;
  onDelete: () => void;
  onCalculate: () => void;
  onMemoryAction: (action: 'MC' | 'MR' | 'M+' | 'M-' | 'MS') => void;
  isScientific?: boolean;
}

export const CalculatorKeypad: React.FC<CalculatorKeypadProps> = ({
  onInput,
  onClear,
  onAllClear,
  onDelete,
  onCalculate,
  onMemoryAction,
  isScientific = true,
}) => {
  const [secondFn, setSecondFn] = useState(false);

  // Audio/tactile feedback function (gentle haptic vibration on mobile devices)
  const triggerTactileFeedback = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(8);
      } catch {}
    }
  };

  const handleKeyClick = (action: () => void) => {
    triggerTactileFeedback();
    action();
  };

  return (
    <div className="flex flex-col gap-2 mt-3 select-none">
      {/* Memory Action Row */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {(['MC', 'MR', 'M+', 'M-', 'MS'] as const).map((mem) => (
          <button
            key={mem}
            id={`btn-mem-${mem.toLowerCase()}`}
            onClick={() => handleKeyClick(() => onMemoryAction(mem))}
            className="py-1.5 sm:py-2 text-xs font-mono-tech font-semibold text-slate-400 hover:text-cyan-300 bg-slate-900/60 hover:bg-slate-800/80 border border-white/5 rounded-lg cursor-pointer transition-all active:scale-95"
          >
            {mem}
          </button>
        ))}
      </div>

      {/* Scientific Function Panel (When scientific mode is active) */}
      {isScientific && (
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 py-1">
          <button
            id="btn-2nd"
            onClick={() => handleKeyClick(() => setSecondFn(!secondFn))}
            className={`py-2 text-xs font-mono-tech font-bold rounded-xl border transition-all cursor-pointer ${
              secondFn
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border-white/5'
            }`}
          >
            2nd
          </button>

          <button
            id="btn-pi"
            onClick={() => handleKeyClick(() => onInput('pi'))}
            className="py-2 text-xs font-mono-tech text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-white/5 rounded-xl cursor-pointer"
          >
            π
          </button>

          <button
            id="btn-e"
            onClick={() => handleKeyClick(() => onInput('e'))}
            className="py-2 text-xs font-mono-tech text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-white/5 rounded-xl cursor-pointer"
          >
            e
          </button>

          <button
            id="btn-lparen"
            onClick={() => handleKeyClick(() => onInput('('))}
            className="py-2 text-sm font-mono-tech text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-white/5 rounded-xl cursor-pointer"
          >
            (
          </button>

          <button
            id="btn-rparen"
            onClick={() => handleKeyClick(() => onInput(')'))}
            className="py-2 text-sm font-mono-tech text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-white/5 rounded-xl cursor-pointer"
          >
            )
          </button>

          {/* Row 2: Trig */}
          <button
            id="btn-sin"
            onClick={() => handleKeyClick(() => onInput(secondFn ? 'asin(' : 'sin('))}
            className="py-2 text-xs font-mono-tech text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-white/5 rounded-xl cursor-pointer"
          >
            {secondFn ? 'sin⁻¹' : 'sin'}
          </button>

          <button
            id="btn-cos"
            onClick={() => handleKeyClick(() => onInput(secondFn ? 'acos(' : 'cos('))}
            className="py-2 text-xs font-mono-tech text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-white/5 rounded-xl cursor-pointer"
          >
            {secondFn ? 'cos⁻¹' : 'cos'}
          </button>

          <button
            id="btn-tan"
            onClick={() => handleKeyClick(() => onInput(secondFn ? 'atan(' : 'tan('))}
            className="py-2 text-xs font-mono-tech text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-white/5 rounded-xl cursor-pointer"
          >
            {secondFn ? 'tan⁻¹' : 'tan'}
          </button>

          <button
            id="btn-ln"
            onClick={() => handleKeyClick(() => onInput(secondFn ? 'exp(' : 'ln('))}
            className="py-2 text-xs font-mono-tech text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-white/5 rounded-xl cursor-pointer"
          >
            {secondFn ? 'eˣ' : 'ln'}
          </button>

          <button
            id="btn-log"
            onClick={() => handleKeyClick(() => onInput(secondFn ? '10^' : 'log('))}
            className="py-2 text-xs font-mono-tech text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-white/5 rounded-xl cursor-pointer"
          >
            {secondFn ? '10ˣ' : 'log'}
          </button>

          {/* Row 3: Powers and factorials */}
          <button
            id="btn-sqrt"
            onClick={() => handleKeyClick(() => onInput(secondFn ? 'cbrt(' : 'sqrt('))}
            className="py-2 text-xs font-mono-tech text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-white/5 rounded-xl cursor-pointer"
          >
            {secondFn ? '∛x' : '√x'}
          </button>

          <button
            id="btn-pow"
            onClick={() => handleKeyClick(() => onInput('^'))}
            className="py-2 text-xs font-mono-tech text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-white/5 rounded-xl cursor-pointer"
          >
            xʸ
          </button>

          <button
            id="btn-sqr"
            onClick={() => handleKeyClick(() => onInput('^2'))}
            className="py-2 text-xs font-mono-tech text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-white/5 rounded-xl cursor-pointer"
          >
            x²
          </button>

          <button
            id="btn-fact"
            onClick={() => handleKeyClick(() => onInput('!'))}
            className="py-2 text-xs font-mono-tech text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-white/5 rounded-xl cursor-pointer"
          >
            x!
          </button>

          <button
            id="btn-mod"
            onClick={() => handleKeyClick(() => onInput('%'))}
            className="py-2 text-xs font-mono-tech text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-white/5 rounded-xl cursor-pointer"
          >
            mod
          </button>
        </div>
      )}

      {/* Primary 4x5 Keypad Matrix */}
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {/* Row 1 */}
        <button
          id="btn-ac"
          onClick={() => handleKeyClick(onAllClear)}
          className="calc-key py-3.5 sm:py-4 rounded-xl text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/20 font-mono-tech font-bold text-base cursor-pointer shadow-sm"
        >
          AC
        </button>

        <button
          id="btn-c"
          onClick={() => handleKeyClick(onClear)}
          className="calc-key py-3.5 sm:py-4 rounded-xl text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/20 font-mono-tech font-bold text-base cursor-pointer shadow-sm"
        >
          C
        </button>

        <button
          id="btn-backspace"
          onClick={() => handleKeyClick(onDelete)}
          className="calc-key py-3.5 sm:py-4 rounded-xl text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-700/80 border border-white/5 flex items-center justify-center cursor-pointer shadow-sm"
          title="Backspace (Delete)"
        >
          <Delete className="w-5 h-5" />
        </button>

        <button
          id="btn-divide"
          onClick={() => handleKeyClick(() => onInput('/'))}
          className="calc-key py-3.5 sm:py-4 rounded-xl text-cyan-300 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-500/30 font-mono-tech font-bold text-xl cursor-pointer shadow-sm"
        >
          ÷
        </button>

        {/* Row 2 */}
        <button
          id="btn-num-7"
          onClick={() => handleKeyClick(() => onInput('7'))}
          className="calc-key py-3.5 sm:py-4 rounded-xl text-white bg-slate-800/80 hover:bg-slate-700/90 border border-white/10 font-mono-tech font-semibold text-xl cursor-pointer shadow-sm"
        >
          7
        </button>
        <button
          id="btn-num-8"
          onClick={() => handleKeyClick(() => onInput('8'))}
          className="calc-key py-3.5 sm:py-4 rounded-xl text-white bg-slate-800/80 hover:bg-slate-700/90 border border-white/10 font-mono-tech font-semibold text-xl cursor-pointer shadow-sm"
        >
          8
        </button>
        <button
          id="btn-num-9"
          onClick={() => handleKeyClick(() => onInput('9'))}
          className="calc-key py-3.5 sm:py-4 rounded-xl text-white bg-slate-800/80 hover:bg-slate-700/90 border border-white/10 font-mono-tech font-semibold text-xl cursor-pointer shadow-sm"
        >
          9
        </button>
        <button
          id="btn-multiply"
          onClick={() => handleKeyClick(() => onInput('*'))}
          className="calc-key py-3.5 sm:py-4 rounded-xl text-cyan-300 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-500/30 font-mono-tech font-bold text-xl cursor-pointer shadow-sm"
        >
          ×
        </button>

        {/* Row 3 */}
        <button
          id="btn-num-4"
          onClick={() => handleKeyClick(() => onInput('4'))}
          className="calc-key py-3.5 sm:py-4 rounded-xl text-white bg-slate-800/80 hover:bg-slate-700/90 border border-white/10 font-mono-tech font-semibold text-xl cursor-pointer shadow-sm"
        >
          4
        </button>
        <button
          id="btn-num-5"
          onClick={() => handleKeyClick(() => onInput('5'))}
          className="calc-key py-3.5 sm:py-4 rounded-xl text-white bg-slate-800/80 hover:bg-slate-700/90 border border-white/10 font-mono-tech font-semibold text-xl cursor-pointer shadow-sm"
        >
          5
        </button>
        <button
          id="btn-num-6"
          onClick={() => handleKeyClick(() => onInput('6'))}
          className="calc-key py-3.5 sm:py-4 rounded-xl text-white bg-slate-800/80 hover:bg-slate-700/90 border border-white/10 font-mono-tech font-semibold text-xl cursor-pointer shadow-sm"
        >
          6
        </button>
        <button
          id="btn-subtract"
          onClick={() => handleKeyClick(() => onInput('-'))}
          className="calc-key py-3.5 sm:py-4 rounded-xl text-cyan-300 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-500/30 font-mono-tech font-bold text-xl cursor-pointer shadow-sm"
        >
          −
        </button>

        {/* Row 4 */}
        <button
          id="btn-num-1"
          onClick={() => handleKeyClick(() => onInput('1'))}
          className="calc-key py-3.5 sm:py-4 rounded-xl text-white bg-slate-800/80 hover:bg-slate-700/90 border border-white/10 font-mono-tech font-semibold text-xl cursor-pointer shadow-sm"
        >
          1
        </button>
        <button
          id="btn-num-2"
          onClick={() => handleKeyClick(() => onInput('2'))}
          className="calc-key py-3.5 sm:py-4 rounded-xl text-white bg-slate-800/80 hover:bg-slate-700/90 border border-white/10 font-mono-tech font-semibold text-xl cursor-pointer shadow-sm"
        >
          2
        </button>
        <button
          id="btn-num-3"
          onClick={() => handleKeyClick(() => onInput('3'))}
          className="calc-key py-3.5 sm:py-4 rounded-xl text-white bg-slate-800/80 hover:bg-slate-700/90 border border-white/10 font-mono-tech font-semibold text-xl cursor-pointer shadow-sm"
        >
          3
        </button>
        <button
          id="btn-add"
          onClick={() => handleKeyClick(() => onInput('+'))}
          className="calc-key py-3.5 sm:py-4 rounded-xl text-cyan-300 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-500/30 font-mono-tech font-bold text-xl cursor-pointer shadow-sm"
        >
          +
        </button>

        {/* Row 5 */}
        <button
          id="btn-num-0"
          onClick={() => handleKeyClick(() => onInput('0'))}
          className="calc-key py-3.5 sm:py-4 rounded-xl text-white bg-slate-800/80 hover:bg-slate-700/90 border border-white/10 font-mono-tech font-semibold text-xl cursor-pointer shadow-sm"
        >
          0
        </button>
        <button
          id="btn-dot"
          onClick={() => handleKeyClick(() => onInput('.'))}
          className="calc-key py-3.5 sm:py-4 rounded-xl text-white bg-slate-800/80 hover:bg-slate-700/90 border border-white/10 font-mono-tech font-semibold text-xl cursor-pointer shadow-sm"
        >
          .
        </button>
        <button
          id="btn-negate"
          onClick={() => handleKeyClick(() => onInput('(-'))}
          className="calc-key py-3.5 sm:py-4 rounded-xl text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/90 border border-white/10 font-mono-tech font-semibold text-base cursor-pointer shadow-sm"
          title="Negate sign"
        >
          ±
        </button>
        <button
          id="btn-equals"
          onClick={() => handleKeyClick(onCalculate)}
          className="calc-key py-3.5 sm:py-4 rounded-xl text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-mono-tech font-bold text-2xl border border-cyan-400/40 cursor-pointer shadow-md shadow-cyan-500/20 active:scale-95"
        >
          =
        </button>
      </div>
    </div>
  );
};
