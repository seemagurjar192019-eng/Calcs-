import React, { useState, useEffect, useRef } from 'react';
import { Search, Calculator, Cpu, LineChart, Table2, Sigma, BookOpen, DollarSign, Calendar, ArrowRightLeft, Sparkles, X, Binary } from 'lucide-react';
import { CalculatorMode } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (mode: CalculatorMode) => void;
  onInsertExpression: (expr: string) => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectMode,
  onInsertExpression,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const commands: CommandItem[] = [
    // Modes
    {
      id: 'mode-scientific',
      title: 'Scientific Calculator',
      category: 'Mode',
      subtitle: 'Trigonometry, logarithms, powers, and combinatorics',
      icon: <Calculator className="w-4 h-4 text-cyan-400" />,
      action: () => { onSelectMode('scientific'); onClose(); },
    },
    {
      id: 'mode-graphing',
      title: '2D Graphing Engine',
      category: 'Mode',
      subtitle: 'Plot interactive functions, roots, tangents, and trace curves',
      icon: <LineChart className="w-4 h-4 text-emerald-400" />,
      action: () => { onSelectMode('graphing'); onClose(); },
    },
    {
      id: 'mode-programmer',
      title: 'Programmer Calculator',
      category: 'Mode',
      subtitle: 'Hex, Octal, Binary, 64-bit integer bitwise operations',
      icon: <Binary className="w-4 h-4 text-amber-400" />,
      action: () => { onSelectMode('programmer'); onClose(); },
    },
    {
      id: 'mode-matrices',
      title: 'Matrix Workbench',
      category: 'Mode',
      subtitle: 'Determinants, inverses, Gaussian elimination, row operations',
      icon: <Table2 className="w-4 h-4 text-purple-400" />,
      action: () => { onSelectMode('matrices'); onClose(); },
    },
    {
      id: 'mode-calculus',
      title: 'Calculus Studio',
      category: 'Mode',
      subtitle: 'Numerical integration (Simpson\'s rule), derivatives, limits',
      icon: <Sigma className="w-4 h-4 text-rose-400" />,
      action: () => { onSelectMode('calculus'); onClose(); },
    },
    {
      id: 'mode-steps',
      title: 'Step-by-Step Solver',
      category: 'Mode',
      subtitle: 'Transparent algebraic derivation steps for equations',
      icon: <BookOpen className="w-4 h-4 text-blue-400" />,
      action: () => { onSelectMode('steps'); onClose(); },
    },
    {
      id: 'mode-finance',
      title: 'Finance & Loan Calculator',
      category: 'Mode',
      subtitle: 'EMI, Amortization schedules, compound interest, SIP, CAGR',
      icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
      action: () => { onSelectMode('finance'); onClose(); },
    },
    {
      id: 'mode-converter',
      title: 'Unit Conversion Matrix',
      category: 'Mode',
      subtitle: 'Length, mass, temp, speed, area, volume, digital data',
      icon: <ArrowRightLeft className="w-4 h-4 text-teal-400" />,
      action: () => { onSelectMode('converter'); onClose(); },
    },
    {
      id: 'mode-dates',
      title: 'Date & Calendar Calculator',
      category: 'Mode',
      subtitle: 'Business days, date spans, age calculation',
      icon: <Calendar className="w-4 h-4 text-orange-400" />,
      action: () => { onSelectMode('dates'); onClose(); },
    },
    {
      id: 'mode-ai-tutor',
      title: 'AI Math Assistant (Gemini)',
      category: 'AI Engine',
      subtitle: 'Low-latency explanations & high-thinking mathematical derivations',
      icon: <Sparkles className="w-4 h-4 text-sky-400" />,
      action: () => { onSelectMode('ai-tutor'); onClose(); },
    },

    // Constants
    {
      id: 'const-pi',
      title: 'Constant π (Pi)',
      category: 'Constant',
      subtitle: '3.141592653589793',
      icon: <span className="font-mono-tech font-bold text-xs text-cyan-400">π</span>,
      action: () => { onInsertExpression('pi'); onClose(); },
    },
    {
      id: 'const-e',
      title: 'Constant e (Euler)',
      category: 'Constant',
      subtitle: '2.718281828459045',
      icon: <span className="font-mono-tech font-bold text-xs text-amber-400">e</span>,
      action: () => { onInsertExpression('e'); onClose(); },
    },
    {
      id: 'const-c',
      title: 'Speed of Light (c)',
      category: 'Constant',
      subtitle: '299,792,458 m/s',
      icon: <span className="font-mono-tech font-bold text-xs text-blue-400">c</span>,
      action: () => { onInsertExpression('299792458'); onClose(); },
    },
    {
      id: 'const-g',
      title: 'Standard Gravity (g)',
      category: 'Constant',
      subtitle: '9.80665 m/s²',
      icon: <span className="font-mono-tech font-bold text-xs text-emerald-400">g</span>,
      action: () => { onInsertExpression('9.80665'); onClose(); },
    },
  ];

  const filtered = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase()) ||
    cmd.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="command-palette-backdrop"
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-16 sm:pt-24 p-4"
      onClick={onClose}
    >
      <div
        id="command-palette-dialog"
        className="mat-modal w-full max-w-xl rounded-2xl overflow-hidden border border-white/15 animate-in fade-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-slate-900/90">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, tool, constant, or formula... (↑↓ to navigate)"
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 flex flex-col gap-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              No matching commands or tools found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected ? 'bg-cyan-500/20 text-white border border-cyan-500/30' : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-slate-800/80 border border-white/5 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white truncate">{item.title}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-white/5">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">{item.subtitle}</p>
                  </div>
                  <span className="text-[11px] font-mono-tech text-slate-500">↵</span>
                </div>
              );
            })
          )}
        </div>

        {/* Keyboard Footer */}
        <div className="px-4 py-2 bg-slate-950/80 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
          <span>Navigate with <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">↓</kbd></span>
          <span>Select with <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">Enter</kbd></span>
          <span>Close with <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">ESC</kbd></span>
        </div>
      </div>
    </div>
  );
};
