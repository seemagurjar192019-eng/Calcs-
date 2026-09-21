/**
 * Core Type Definitions for Precision Calculator
 */

export type CalculatorMode =
  | 'basic'
  | 'scientific'
  | 'programmer'
  | 'fraction'
  | 'graphing'
  | 'matrices'
  | 'calculus'
  | 'steps'
  | 'equations'
  | 'statistics'
  | 'finance'
  | 'converter'
  | 'dates'
  | 'notebook'
  | 'macros'
  | 'ai-tutor';

export type AngleMode = 'DEG' | 'RAD' | 'GRAD';

export type NumberBase = 'HEX' | 'DEC' | 'OCT' | 'BIN';
export type WordSize = 8 | 16 | 32 | 64;

export type ResultRepresentation = 'standard' | 'fraction' | 'scientific' | 'engineering';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  mode: CalculatorMode;
  pinned?: boolean;
  notes?: string;
}

export interface FractionValue {
  numerator: bigint;
  denominator: bigint;
}

export interface MemoryState {
  primary: number;
  slots: { [key: string]: number };
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  mode?: CalculatorMode;
  variables: Record<string, number>;
  constants?: Record<string, number>;
  functions?: Record<string, string>;
  history: HistoryItem[];
  created?: number;
  updated?: number;
}

export interface GeminiStep {
  stepNumber: number;
  expression: string;
  explanation: string;
}

export interface GeminiSolveResponse {
  problem: string;
  finalAnswer?: string;
  steps?: GeminiStep[];
  explanation?: string;
  modelUsed: string;
}

export interface MacroStep {
  id: string;
  action: 'add' | 'subtract' | 'multiply' | 'divide' | 'percent' | 'round' | 'tax' | 'power';
  value: number;
  description: string;
}

export interface Macro {
  id: string;
  name: string;
  description: string;
  steps: MacroStep[];
}

export interface NotebookBlock {
  id: string;
  type: 'calc' | 'text' | 'table';
  input: string;
  output?: string;
  error?: string;
}
