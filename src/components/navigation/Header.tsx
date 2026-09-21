import React from 'react';
import {
  Calculator,
  History,
  Command,
  Sun,
  Moon,
  FolderKanban,
  Sparkles,
  Layers,
} from 'lucide-react';
import { CalculatorMode, Workspace } from '../../types';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentMode: CalculatorMode;
  onSelectMode: (mode: CalculatorMode) => void;
  workspaces: Workspace[];
  activeWorkspaceId: string;
  onSelectWorkspace: (wsId: string) => void;
  onToggleHistory: () => void;
  onOpenCommandPalette: () => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  onOpenAI: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  workspaces,
  activeWorkspaceId,
  onSelectWorkspace,
  onToggleHistory,
  onOpenCommandPalette,
  isDarkTheme,
  onToggleTheme,
  onOpenAI,
}) => {
  const modes: { id: CalculatorMode; label: string }[] = [
    { id: 'scientific', label: 'Scientific' },
    { id: 'graphing', label: 'Graphing' },
    { id: 'programmer', label: 'Programmer' },
    { id: 'matrices', label: 'Matrices' },
    { id: 'calculus', label: 'Calculus' },
    { id: 'steps', label: 'Step Solver' },
    { id: 'finance', label: 'Finance' },
    { id: 'converter', label: 'Converter' },
    { id: 'dates', label: 'Dates' },
    { id: 'macros', label: 'Macros' },
    { id: 'notebook', label: 'Notebook' },
  ];

  return (
    <header
      id="app-main-header"
      className="mat-1 sticky top-0 z-30 px-3 sm:px-6 py-2.5 border-b border-white/10 flex flex-col gap-2"
    >
      {/* Top Bar: Brand, Workspace, Actions */}
      <div className="flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-1 flex items-center justify-center shadow-md shadow-cyan-500/20 border border-cyan-300/40">
            <Calculator className="w-4 h-4 text-slate-950 font-bold" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
              Precision
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono-tech">
                PRO
              </span>
            </span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">Production Calculator</span>
          </div>
        </div>

        {/* Workspace Switcher */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-xl border border-white/5 text-xs text-slate-300">
          <FolderKanban className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-500 text-[11px]">Workspace:</span>
          <select
            id="workspace-select"
            value={activeWorkspaceId}
            onChange={(e) => onSelectWorkspace(e.target.value)}
            className="bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer"
          >
            {workspaces.map((ws) => (
              <option key={ws.id} value={ws.id} className="bg-slate-900 text-white">
                {ws.name}
              </option>
            ))}
          </select>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Command Palette Trigger */}
          <button
            id="btn-open-cmd"
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5 text-xs cursor-pointer transition-colors"
            title="Search tools and modes (Ctrl + K)"
          >
            <Command className="w-3.5 h-3.5" />
            <span className="font-mono-tech text-[11px]">⌘K</span>
          </button>

          {/* AI Math Tutor */}
          <button
            id="btn-nav-ai"
            onClick={onOpenAI}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all border ${
              currentMode === 'ai-tutor'
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sm shadow-sky-500/20'
                : 'bg-sky-950/40 hover:bg-sky-900/50 text-sky-300 border-sky-500/30'
            }`}
            title="Ask Gemini AI Tutor for step-by-step reasoning"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">AI Tutor</span>
          </button>

          {/* History Drawer Trigger */}
          <button
            id="btn-toggle-history"
            onClick={onToggleHistory}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/5 text-xs flex items-center gap-1 cursor-pointer transition-colors"
            title="Open calculation history"
          >
            <History className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">History</span>
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Theme Toggle */}
          <button
            id="btn-theme-toggle"
            onClick={onToggleTheme}
            className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5 cursor-pointer transition-colors"
            title={isDarkTheme ? 'Switch to Light mode' : 'Switch to Dark mode'}
          >
            {isDarkTheme ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
          </button>
        </div>
      </div>

      {/* Mode Navigation Carousel / Tab Bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-xs">
        {modes.map((m) => {
          const isActive = currentMode === m.id;
          return (
            <button
              key={m.id}
              id={`nav-tab-${m.id}`}
              onClick={() => onSelectMode(m.id)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
