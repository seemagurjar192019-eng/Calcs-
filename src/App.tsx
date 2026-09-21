import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  CalculatorMode,
  AngleMode,
  NumberBase,
  WordSize,
  HistoryItem,
  Workspace,
} from './types';
import { ExpressionParser } from './engine/parser';
import { ProgrammerEngine } from './engine/programmer';
import { StorageEngine } from './engine/storage';
import { Rational } from './engine/fractions';

import { Header } from './components/navigation/Header';
import { CommandPalette } from './components/navigation/CommandPalette';
import { HistoryPanel } from './components/history/HistoryPanel';
import { CalculatorDisplay } from './components/calculator/CalculatorDisplay';
import { CalculatorKeypad } from './components/calculator/CalculatorKeypad';
import { ProgrammerKeypad } from './components/calculator/ProgrammerKeypad';

import { GraphingLab } from './components/modes/GraphingLab';
import { MatrixWorkbench } from './components/modes/MatrixWorkbench';
import { CalculusStudio } from './components/modes/CalculusStudio';
import { StepSolverLab } from './components/modes/StepSolverLab';
import { FinanceLab } from './components/modes/FinanceLab';
import { UnitConverterLab } from './components/modes/UnitConverterLab';
import { DateToolsLab } from './components/modes/DateToolsLab';
import { MacroLab } from './components/modes/MacroLab';
import { NotebookLab } from './components/modes/NotebookLab';
import { AIMathTutor } from './components/modes/AIMathTutor';

export default function App() {
  // Mode & Theme
  const [mode, setMode] = useState<CalculatorMode>('scientific');
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Expression & Display State
  const [expression, setExpression] = useState('0');
  const [previewResult, setPreviewResult] = useState('');
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [isFractionMode, setIsFractionMode] = useState(false);
  const [memoryValue, setMemoryValue] = useState<number | null>(null);

  // Programmer Mode State
  const [progValue, setProgValue] = useState<bigint>(0n);
  const [progBase, setProgBase] = useState<NumberBase>('DEC');
  const [progWordSize, setProgWordSize] = useState<WordSize>(64);
  const [progPendingOp, setProgPendingOp] = useState<'AND' | 'OR' | 'XOR' | 'LSH' | 'RSH' | 'ASHR' | null>(null);
  const [progLeftOperand, setProgLeftOperand] = useState<bigint | null>(null);

  // Workspaces
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    { id: 'ws-general', name: 'General Math', mode: 'scientific', history: [], variables: {}, constants: {} },
    { id: 'ws-physics', name: 'Physics Lab', mode: 'graphing', history: [], variables: {}, constants: {} },
    { id: 'ws-finance', name: 'Finance & Loans', mode: 'finance', history: [], variables: {}, constants: {} },
    { id: 'ws-engineering', name: 'Engineering', mode: 'calculus', history: [], variables: {}, constants: {} },
  ]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState('ws-general');

  // History
  const [history, setHistory] = useState<HistoryItem[]>(() => StorageEngine.getHistory());

  // Web Audio Context for iPhone-like responsive acoustic feedback
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playClickSound = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) audioCtxRef.current = new AudioContextClass();
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      if (audioCtxRef.current) {
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtxRef.current.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, audioCtxRef.current.currentTime + 0.03);
        gain.gain.setValueAtTime(0.04, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.03);
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 0.035);
      }
    } catch {}
  }, []);

  // Update Live Preview whenever expression changes
  useEffect(() => {
    if (expression === '0' || expression === '') {
      setPreviewResult('');
      return;
    }

    try {
      const parser = new ExpressionParser(angleMode);
      const val = parser.evaluate(expression);

      if (Number.isFinite(val)) {
        if (isFractionMode) {
          const frac = Rational.fromNumber(val);
          setPreviewResult(frac.toString());
        } else {
          setPreviewResult(String(val));
        }
      } else {
        setPreviewResult('');
      }
    } catch {
      setPreviewResult('');
    }
  }, [expression, angleMode, isFractionMode]);

  // Save history on changes
  useEffect(() => {
    StorageEngine.saveHistory(history);
  }, [history]);

  // Scientific Keypad Handlers
  const handleInputToken = useCallback((token: string) => {
    playClickSound();
    setExpression((prev) => {
      if (prev === '0' || prev === 'Error') {
        return token;
      }
      return prev + token;
    });
  }, [playClickSound]);

  const handleClear = useCallback(() => {
    playClickSound();
    setExpression('0');
    setPreviewResult('');
  }, [playClickSound]);

  const handleBackspace = useCallback(() => {
    playClickSound();
    setExpression((prev) => {
      if (prev.length <= 1 || prev === 'Error') return '0';
      return prev.slice(0, -1);
    });
  }, [playClickSound]);

  const handleCalculate = useCallback(() => {
    playClickSound();
    if (expression === '0' || !expression.trim()) return;

    try {
      const parser = new ExpressionParser(angleMode);
      const val = parser.evaluate(expression);

      let resultStr = String(val);
      if (isFractionMode) {
        resultStr = Rational.fromNumber(val).toString();
      }

      // Add to history
      const item: HistoryItem = {
        id: `calc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        expression,
        result: resultStr,
        timestamp: Date.now(),
        mode,
      };
      setHistory((prev) => [item, ...prev]);

      setExpression(resultStr);
      setPreviewResult('');
    } catch (err: any) {
      setPreviewResult(`Error: ${err.message || 'Invalid syntax'}`);
    }
  }, [expression, angleMode, isFractionMode, mode, playClickSound]);

  // Memory operations
  const handleMemoryOp = useCallback((op: 'MC' | 'MR' | 'M+' | 'M-' | 'MS') => {
    playClickSound();
    try {
      const parser = new ExpressionParser(angleMode);
      const currentVal = parser.evaluate(expression);

      switch (op) {
        case 'MC':
          setMemoryValue(null);
          break;
        case 'MR':
          if (memoryValue !== null) {
            setExpression(String(memoryValue));
          }
          break;
        case 'MS':
          setMemoryValue(currentVal);
          break;
        case 'M+':
          setMemoryValue((prev) => (prev ?? 0) + currentVal);
          break;
        case 'M-':
          setMemoryValue((prev) => (prev ?? 0) - currentVal);
          break;
      }
    } catch {}
  }, [expression, angleMode, memoryValue, playClickSound]);

  // Programmer Mode Handlers
  const handleProgDigit = (digit: string) => {
    playClickSound();
    const currentStr = ProgrammerEngine.formatBase(progValue, progBase, progWordSize);
    const newStr = (currentStr === '0' ? '' : currentStr) + digit;
    const parsed = ProgrammerEngine.parseBase(newStr, progBase, progWordSize);
    setProgValue(parsed);
  };

  const handleProgBitToggle = (bitIndex: number) => {
    playClickSound();
    const next = ProgrammerEngine.toggleBit(progValue, bitIndex, progWordSize);
    setProgValue(next);
  };

  const handleProgBitwiseOp = (op: 'AND' | 'OR' | 'XOR' | 'NOT' | 'LSH' | 'RSH' | 'ASHR') => {
    playClickSound();
    if (op === 'NOT') {
      setProgValue(ProgrammerEngine.bitwiseNot(progValue, progWordSize));
      return;
    }
    setProgLeftOperand(progValue);
    setProgPendingOp(op);
    setProgValue(0n);
  };

  const handleProgCalculate = () => {
    playClickSound();
    if (progLeftOperand !== null && progPendingOp) {
      let res = 0n;
      switch (progPendingOp) {
        case 'AND':
          res = ProgrammerEngine.bitwiseAnd(progLeftOperand, progValue, progWordSize);
          break;
        case 'OR':
          res = ProgrammerEngine.bitwiseOr(progLeftOperand, progValue, progWordSize);
          break;
        case 'XOR':
          res = ProgrammerEngine.bitwiseXor(progLeftOperand, progValue, progWordSize);
          break;
        case 'LSH':
          res = ProgrammerEngine.lsh(progLeftOperand, Number(progValue), progWordSize);
          break;
        case 'RSH':
          res = ProgrammerEngine.rsh(progLeftOperand, Number(progValue), progWordSize);
          break;
        case 'ASHR':
          res = ProgrammerEngine.ashr(progLeftOperand, Number(progValue), progWordSize);
          break;
      }
      setProgValue(res);
      setProgLeftOperand(null);
      setProgPendingOp(null);
    }
  };

  const handleProgClear = () => {
    playClickSound();
    setProgValue(0n);
    setProgLeftOperand(null);
    setProgPendingOp(null);
  };

  // Global Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command Palette (Ctrl+K or Cmd+K)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // History Drawer (Ctrl+H)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setIsHistoryOpen((prev) => !prev);
        return;
      }

      // If typing in an input element or modal, do not intercept
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        return;
      }

      if (mode === 'scientific') {
        if (e.key >= '0' && e.key <= '9') {
          handleInputToken(e.key);
        } else if (['+', '-', '*', '/', '(', ')', '^', '%', '.'].includes(e.key)) {
          handleInputToken(e.key);
        } else if (e.key === 'Enter' || e.key === '=') {
          e.preventDefault();
          handleCalculate();
        } else if (e.key === 'Backspace') {
          e.preventDefault();
          handleBackspace();
        } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
          handleClear();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, handleInputToken, handleCalculate, handleBackspace, handleClear]);

  return (
    <div
      id="app-root"
      className={`min-h-screen w-full flex flex-col ${
        isDarkTheme ? 'theme-dark bg-slate-950 text-slate-100' : 'theme-light bg-slate-100 text-slate-900'
      }`}
    >
      {/* Top Application Header */}
      <Header
        currentMode={mode}
        onSelectMode={(m) => setMode(m)}
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        onSelectWorkspace={(wsId) => {
          setActiveWorkspaceId(wsId);
          const target = workspaces.find((w) => w.id === wsId);
          if (target && target.mode) setMode(target.mode);
        }}
        onToggleHistory={() => setIsHistoryOpen((prev) => !prev)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        isDarkTheme={isDarkTheme}
        onToggleTheme={() => setIsDarkTheme(!isDarkTheme)}
        onOpenAI={() => setMode('ai-tutor')}
      />

      {/* Main Responsive Workspace Stage */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-3 sm:p-6 flex flex-col gap-4">
        {/* SCIENTIFIC MODE */}
        {mode === 'scientific' && (
          <div className="w-full max-w-xl mx-auto flex flex-col gap-4">
            <CalculatorDisplay
              expression={expression}
              displayValue={expression}
              livePreview={previewResult || null}
              angleMode={angleMode}
              onAngleModeToggle={() => setAngleMode((prev) => (prev === 'DEG' ? 'RAD' : prev === 'RAD' ? 'GRAD' : 'DEG'))}
              resultMode={isFractionMode ? 'fraction' : 'standard'}
              onResultModeToggle={() => setIsFractionMode((prev) => !prev)}
              memoryValue={memoryValue ?? 0}
              onOpenAIAssistant={() => setMode('ai-tutor')}
            />
            <CalculatorKeypad
              onInput={handleInputToken}
              onCalculate={handleCalculate}
              onClear={handleClear}
              onAllClear={handleClear}
              onDelete={handleBackspace}
              onMemoryAction={handleMemoryOp}
              isScientific={true}
            />
          </div>
        )}

        {/* PROGRAMMER MODE */}
        {mode === 'programmer' && (
          <div className="w-full max-w-xl mx-auto flex flex-col gap-4">
            <ProgrammerKeypad
              currentValue={progValue}
              base={progBase}
              wordSize={progWordSize}
              onBaseChange={(b) => setProgBase(b)}
              onWordSizeChange={(s) => setProgWordSize(s)}
              onBitToggle={handleProgBitToggle}
              onBitwiseOp={handleProgBitwiseOp}
              onInputDigit={handleProgDigit}
              onClear={handleProgClear}
              onCalculate={handleProgCalculate}
            />
          </div>
        )}

        {/* GRAPHING 2D LAB */}
        {mode === 'graphing' && (
          <GraphingLab initialExpr={expression !== '0' && expression.includes('x') ? expression : 'sin(x)'} />
        )}

        {/* MATRIX WORKBENCH */}
        {mode === 'matrices' && <MatrixWorkbench />}

        {/* CALCULUS STUDIO */}
        {mode === 'calculus' && <CalculusStudio />}

        {/* STEP-BY-STEP SOLVER */}
        {mode === 'steps' && <StepSolverLab />}

        {/* FINANCE LAB */}
        {mode === 'finance' && <FinanceLab />}

        {/* UNIT CONVERTER */}
        {mode === 'converter' && <UnitConverterLab />}

        {/* DATE TOOLS */}
        {mode === 'dates' && <DateToolsLab />}

        {/* MACRO PIPELINE */}
        {mode === 'macros' && <MacroLab />}

        {/* REPL NOTEBOOK */}
        {mode === 'notebook' && <NotebookLab />}

        {/* GEMINI AI TUTOR */}
        {mode === 'ai-tutor' && (
          <AIMathTutor
            currentExpression={expression !== '0' ? expression : ''}
            onApplyResult={(res) => {
              setExpression(res);
              setMode('scientific');
            }}
          />
        )}
      </main>

      {/* Command Palette Modal (Ctrl + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectMode={(m) => setMode(m)}
        onInsertExpression={(expr) => {
          handleInputToken(expr);
          setMode('scientific');
        }}
      />

      {/* History Slide-Over Drawer */}
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectExpression={(expr) => {
          setExpression(expr);
          setMode('scientific');
        }}
        onTogglePin={(id) => {
          setHistory((prev) =>
            prev.map((item) => (item.id === id ? { ...item, pinned: !item.pinned } : item))
          );
        }}
        onClearHistory={() => setHistory([])}
        onDeleteHistoryItem={(id) => setHistory((prev) => prev.filter((item) => item.id !== id))}
      />
    </div>
  );
}
