import React from 'react';
import { X, Trash2, Pin, PinOff, Copy, ArrowUpRight, Download } from 'lucide-react';
import { HistoryItem } from '../../types';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectExpression: (expr: string) => void;
  onTogglePin: (id: string) => void;
  onClearHistory: () => void;
  onDeleteHistoryItem: (id: string) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  isOpen,
  onClose,
  history,
  onSelectExpression,
  onTogglePin,
  onClearHistory,
  onDeleteHistoryItem,
}) => {
  if (!isOpen) return null;

  const exportHistoryCSV = () => {
    const rows = [
      ['Timestamp', 'Mode', 'Expression', 'Result'],
      ...history.map((h) => [
        new Date(h.timestamp).toISOString(),
        h.mode,
        `"${h.expression.replace(/"/g, '""')}"`,
        `"${h.result.replace(/"/g, '""')}"`,
      ]),
    ];
    const csvContent = rows.map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `calculator_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      id="history-backdrop"
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end"
      onClick={onClose}
    >
      <div
        id="history-drawer"
        className="mat-modal w-full max-w-md h-full flex flex-col border-l border-white/10 shadow-2xl animate-in slide-in-from-right duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-base">Calculation History</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono-tech">
              {history.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <>
                <button
                  id="btn-export-csv"
                  onClick={exportHistoryCSV}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/5 cursor-pointer"
                  title="Export history as CSV"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  id="btn-clear-all-history"
                  onClick={onClearHistory}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 cursor-pointer"
                  title="Clear all history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12">
              <p className="text-sm">No calculations yet.</p>
              <p className="text-xs text-slate-600 mt-1">Calculations will be saved automatically.</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition-all flex flex-col gap-1.5 ${
                  item.pinned
                    ? 'bg-amber-950/20 border-amber-500/30'
                    : 'bg-slate-900/70 hover:bg-slate-800/80 border-white/5'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono-tech text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 border border-white/5">
                    {item.mode}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onTogglePin(item.id)}
                      className={`p-1 rounded cursor-pointer ${
                        item.pinned ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title={item.pinned ? 'Unpin' : 'Pin to top'}
                    >
                      {item.pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => onDeleteHistoryItem(item.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 cursor-pointer"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expression */}
                <div className="text-xs text-slate-400 font-mono-tech overflow-x-auto whitespace-nowrap">
                  {item.expression}
                </div>

                {/* Result and Recall Button */}
                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <span className="font-mono-tech font-bold text-white text-base truncate">
                    = {item.result}
                  </span>

                  <button
                    onClick={() => {
                      onSelectExpression(item.result);
                      onClose();
                    }}
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 px-2 py-1 rounded-lg border border-cyan-500/30 cursor-pointer transition-colors"
                    title="Load result into calculator"
                  >
                    <span>Use</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
