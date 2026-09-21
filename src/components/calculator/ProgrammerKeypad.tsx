import React from 'react';
import { NumberBase, WordSize } from '../../types';
import { ProgrammerEngine } from '../../engine/programmer';

interface ProgrammerKeypadProps {
  currentValue: bigint;
  base: NumberBase;
  wordSize: WordSize;
  onBaseChange: (base: NumberBase) => void;
  onWordSizeChange: (size: WordSize) => void;
  onBitToggle: (bitIndex: number) => void;
  onBitwiseOp: (op: 'AND' | 'OR' | 'XOR' | 'NOT' | 'LSH' | 'RSH' | 'ASHR') => void;
  onInputDigit: (digit: string) => void;
  onClear: () => void;
  onCalculate: () => void;
}

export const ProgrammerKeypad: React.FC<ProgrammerKeypadProps> = ({
  currentValue,
  base,
  wordSize,
  onBaseChange,
  onWordSizeChange,
  onBitToggle,
  onBitwiseOp,
  onInputDigit,
  onClear,
  onCalculate,
}) => {
  const hexVal = ProgrammerEngine.formatBase(currentValue, 'HEX', wordSize);
  const decVal = ProgrammerEngine.formatBase(currentValue, 'DEC', wordSize);
  const octVal = ProgrammerEngine.formatBase(currentValue, 'OCT', wordSize);
  const binVal = ProgrammerEngine.formatBase(currentValue, 'BIN', wordSize);

  // Generate array of bits from MSB to LSB
  const bits: number[] = [];
  for (let i = wordSize - 1; i >= 0; i--) {
    const bit = Number((currentValue >> BigInt(i)) & 1n);
    bits.push(bit);
  }

  const isHexDigitActive = (d: string) => {
    if (base === 'HEX') return true;
    if (base === 'DEC') return /[0-9]/.test(d);
    if (base === 'OCT') return /[0-7]/.test(d);
    if (base === 'BIN') return /[0-1]/.test(d);
    return false;
  };

  return (
    <div className="flex flex-col gap-3 select-none">
      {/* Base Simultaneous Readouts & Word Size Bar */}
      <div className="flex flex-col gap-1.5 p-3 rounded-xl mat-1 border border-white/10 text-xs font-mono-tech">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <span className="text-slate-400 font-semibold">Base Systems:</span>
          {/* Word Size Toggle */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-white/5">
            {([64, 32, 16, 8] as WordSize[]).map((size) => (
              <button
                key={size}
                onClick={() => onWordSizeChange(size)}
                className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                  wordSize === size
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {size}b
              </button>
            ))}
          </div>
        </div>

        {/* HEX */}
        <div
          onClick={() => onBaseChange('HEX')}
          className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-colors ${
            base === 'HEX' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' : 'hover:bg-white/5 text-slate-400'
          }`}
        >
          <span className="font-bold w-12">HEX</span>
          <span className="font-mono-tech truncate text-right text-sm">{hexVal || '0'}</span>
        </div>

        {/* DEC */}
        <div
          onClick={() => onBaseChange('DEC')}
          className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-colors ${
            base === 'DEC' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' : 'hover:bg-white/5 text-slate-400'
          }`}
        >
          <span className="font-bold w-12">DEC</span>
          <span className="font-mono-tech truncate text-right text-sm">{decVal || '0'}</span>
        </div>

        {/* OCT */}
        <div
          onClick={() => onBaseChange('OCT')}
          className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-colors ${
            base === 'OCT' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' : 'hover:bg-white/5 text-slate-400'
          }`}
        >
          <span className="font-bold w-12">OCT</span>
          <span className="font-mono-tech truncate text-right text-sm">{octVal || '0'}</span>
        </div>

        {/* BIN */}
        <div
          onClick={() => onBaseChange('BIN')}
          className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-colors ${
            base === 'BIN' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' : 'hover:bg-white/5 text-slate-400'
          }`}
        >
          <span className="font-bold w-12">BIN</span>
          <span className="font-mono-tech truncate text-right text-xs max-w-[240px] sm:max-w-xs">{binVal}</span>
        </div>
      </div>

      {/* Interactive Bit Grid: Click any bit to flip */}
      <div className="p-3 rounded-xl mat-1 border border-white/10 flex flex-col gap-1">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-semibold">Interactive Bit Toggle:</span>
          <span>MSB (bit {wordSize - 1}) → LSB (0)</span>
        </div>
        <div className="grid grid-cols-8 sm:grid-cols-16 gap-1">
          {bits.map((bit, idx) => {
            const actualBitIndex = wordSize - 1 - idx;
            return (
              <button
                key={actualBitIndex}
                onClick={() => onBitToggle(actualBitIndex)}
                className={`h-7 flex flex-col items-center justify-center rounded font-mono-tech text-xs transition-all cursor-pointer ${
                  bit === 1
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/30'
                    : 'bg-slate-900 text-slate-500 hover:bg-slate-800'
                }`}
                title={`Bit ${actualBitIndex}: click to toggle`}
              >
                <span>{bit}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bitwise Operator Toolbar */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 font-mono-tech text-xs">
        {(['AND', 'OR', 'XOR', 'NOT', 'LSH', 'RSH', 'ASHR'] as const).map((op) => (
          <button
            key={op}
            onClick={() => onBitwiseOp(op)}
            className="py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-white/5 font-semibold cursor-pointer transition-colors active:scale-95"
          >
            {op}
          </button>
        ))}
      </div>

      {/* Hex / Numeric Keypad */}
      <div className="grid grid-cols-4 gap-2">
        {['A', 'B', 'C', 'D', 'E', 'F'].map((hex) => {
          const active = isHexDigitActive(hex);
          return (
            <button
              key={hex}
              disabled={!active}
              onClick={() => onInputDigit(hex)}
              className={`py-3 rounded-xl font-mono-tech font-bold text-lg border transition-all ${
                active
                  ? 'bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border-cyan-500/20 cursor-pointer shadow-sm active:scale-95'
                  : 'bg-slate-900/40 text-slate-600 border-transparent cursor-not-allowed opacity-30'
              }`}
            >
              {hex}
            </button>
          );
        })}

        <button
          onClick={onClear}
          className="py-3 rounded-xl font-mono-tech font-bold text-base text-rose-400 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/20 cursor-pointer"
        >
          CLEAR
        </button>

        <button
          onClick={onCalculate}
          className="py-3 rounded-xl font-mono-tech font-bold text-xl text-white bg-gradient-to-r from-cyan-500 to-blue-600 border border-cyan-400/30 cursor-pointer shadow-md"
        >
          =
        </button>

        {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0'].map((num) => {
          const active = isHexDigitActive(num);
          return (
            <button
              key={num}
              disabled={!active}
              onClick={() => onInputDigit(num)}
              className={`py-3 rounded-xl font-mono-tech font-semibold text-lg border transition-all ${
                active
                  ? 'bg-slate-800/90 hover:bg-slate-700 text-white border-white/10 cursor-pointer shadow-sm active:scale-95'
                  : 'bg-slate-900/40 text-slate-600 border-transparent cursor-not-allowed opacity-30'
              }`}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
};
