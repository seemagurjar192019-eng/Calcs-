import React, { useState } from 'react';
import { Copy, Check, CornerDownLeft, Undo2, Redo2, Sparkles } from 'lucide-react';
import { AngleMode, ResultRepresentation } from '../../types';

interface CalculatorDisplayProps {
  expression: string;
  displayValue: string;
  livePreview: string | null;
  angleMode: AngleMode;
  onAngleModeToggle: () => void;
  resultMode: ResultRepresentation;
  onResultModeToggle: () => void;
  memoryValue: number;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onOpenAIAssistant?: () => void;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  expression,
  displayValue,
  livePreview,
  angleMode,
  onAngleModeToggle,
  resultMode,
  onResultModeToggle,
  memoryValue,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onOpenAIAssistant,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayValue || expression);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      id="calc-main-display"
      className="mat-2 rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden border border-white/10 shadow-lg min-h-[160px] sm:min-h-[180px]"
    >
      {/* Top Status & Controls Toolbar */}
      <div className="flex items-center justify-between gap-2 text-xs text-slate-400 pb-2 border-b border-white/5">
        {/* Indicators */}
        <div className="flex items-center gap-2">
          <button
            id="angle-mode-badge"
            onClick={onAngleModeToggle}
            className="px-2 py-0.5 rounded-md font-mono-tech font-bold text-xs bg-slate-800/80 hover:bg-slate-700/80 text-cyan-400 border border-cyan-500/20 cursor-pointer transition-colors"
            title="Toggle Angle Mode (DEG / RAD / GRAD)"
          >
            {angleMode}
          </button>

          <button
            id="rep-mode-badge"
            onClick={onResultModeToggle}
            className="px-2 py-0.5 rounded-md font-mono-tech text-xs bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-white/10 cursor-pointer transition-colors"
            title="Toggle result representation (Standard / Fraction / Scientific / Eng)"
          >
            {resultMode.toUpperCase()}
          </button>

          {memoryValue !== 0 && (
            <span
              id="memory-active-indicator"
              className="px-2 py-0.5 rounded-md font-mono-tech text-xs bg-amber-950/60 text-amber-300 border border-amber-500/30 font-semibold"
              title={`Memory Stored: ${memoryValue}`}
            >
              M: {memoryValue}
            </span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          {onUndo && (
            <button
              id="calc-undo-btn"
              onClick={onUndo}
              disabled={!canUndo}
              className={`p-1.5 rounded-lg border border-white/5 transition-colors ${
                canUndo ? 'hover:bg-white/10 text-slate-300 cursor-pointer' : 'text-slate-600 opacity-40 cursor-not-allowed'
              }`}
              title="Undo last input (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
          )}

          {onRedo && (
            <button
              id="calc-redo-btn"
              onClick={onRedo}
              disabled={!canRedo}
              className={`p-1.5 rounded-lg border border-white/5 transition-colors ${
                canRedo ? 'hover:bg-white/10 text-slate-300 cursor-pointer' : 'text-slate-600 opacity-40 cursor-not-allowed'
              }`}
              title="Redo input (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            id="copy-display-btn"
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 cursor-pointer transition-colors"
            title="Copy value to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {onOpenAIAssistant && (
            <button
              id="ai-explain-trigger"
              onClick={onOpenAIAssistant}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-sky-950/70 hover:bg-sky-900/80 text-sky-300 border border-sky-500/40 text-xs font-semibold cursor-pointer transition-all ml-1 shadow-sm hover:shadow-sky-500/20"
              title="Explain or solve this calculation with Gemini AI"
            >
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span className="hidden sm:inline">AI Tutor</span>
            </button>
          )}
        </div>
      </div>

      {/* Expression line with history trail */}
      <div className="my-1.5 text-right overflow-x-auto whitespace-nowrap text-sm sm:text-base text-slate-400 font-mono-tech min-h-[24px]">
        {expression ? (
          <span>{expression}</span>
        ) : (
          <span className="text-slate-600 italic select-none">Ready</span>
        )}
      </div>

      {/* Main Technical Readout */}
      <div className="flex flex-col items-end justify-end">
        {/* Live Preview if typing an uncompleted expression */}
        {livePreview && livePreview !== displayValue && (
          <div className="text-xs sm:text-sm text-cyan-400/80 font-mono-tech mb-0.5 flex items-center gap-1">
            <CornerDownLeft className="w-3 h-3 text-cyan-500" />
            <span>= {livePreview}</span>
          </div>
        )}

        {/* Primary Large Number */}
        <div
          id="calc-primary-readout"
          className="text-right font-mono-tech font-bold tracking-tight text-white select-all text-3xl sm:text-4xl md:text-5xl truncate max-w-full leading-none"
        >
          {displayValue || '0'}
        </div>
      </div>
    </div>
  );
};
