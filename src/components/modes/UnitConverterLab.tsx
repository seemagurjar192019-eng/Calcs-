import React, { useState } from 'react';
import { UNIT_CATEGORIES, UnitCategory, convertUnits } from '../../engine/units';

export const UnitConverterLab: React.FC = () => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [inputValue, setInputValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');

  const currentCategoryData = UNIT_CATEGORIES[category];

  const valNum = parseFloat(inputValue) || 0;
  let convertedResult = 0;
  try {
    convertedResult = convertUnits(category, fromUnit, toUnit, valNum);
  } catch {}

  const handleCategoryChange = (newCat: UnitCategory) => {
    setCategory(newCat);
    const units = UNIT_CATEGORIES[newCat].units;
    setFromUnit(units[0].id);
    setToUnit(units[1] ? units[1].id : units[0].id);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {(Object.keys(UNIT_CATEGORIES) as UnitCategory[]).map((catKey) => {
          const isSelected = category === catKey;
          return (
            <button
              key={catKey}
              onClick={() => handleCategoryChange(catKey)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'mat-1 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {UNIT_CATEGORIES[catKey].name}
            </button>
          );
        })}
      </div>

      {/* Main Converter Card */}
      <div className="p-4 rounded-2xl mat-2 border border-white/10 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* From side */}
          <div className="flex flex-col gap-2 p-3 bg-slate-900/80 rounded-xl border border-white/5">
            <span className="text-xs text-slate-400">From</span>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="bg-slate-800/90 text-white font-mono-tech text-xl font-bold p-2.5 rounded-xl border border-white/10 focus:outline-none"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="bg-slate-800 text-sm font-medium text-slate-200 p-2 rounded-xl border border-white/5 focus:outline-none cursor-pointer"
            >
              {currentCategoryData.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* To side */}
          <div className="flex flex-col gap-2 p-3 bg-slate-900/80 rounded-xl border border-white/5">
            <span className="text-xs text-slate-400">To</span>
            <div className="bg-slate-800/90 text-cyan-300 font-mono-tech text-xl font-bold p-2.5 rounded-xl border border-cyan-500/20 truncate">
              {convertedResult}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="bg-slate-800 text-sm font-medium text-slate-200 p-2 rounded-xl border border-white/5 focus:outline-none cursor-pointer"
            >
              {currentCategoryData.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Multi-Unit Conversion Grid: Shows this value across ALL units in category */}
      <div className="p-4 rounded-2xl mat-1 border border-white/10 flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-400">
          Simultaneous Conversion Matrix for {currentCategoryData.name}:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs font-mono-tech">
          {currentCategoryData.units.map((u) => {
            let res = 0;
            try {
              res = convertUnits(category, fromUnit, u.id, valNum);
            } catch {}
            return (
              <div
                key={u.id}
                className="p-2.5 rounded-xl bg-slate-900/70 border border-white/5 flex flex-col gap-0.5"
              >
                <span className="text-[11px] text-slate-400 truncate">{u.name}</span>
                <span className="text-white font-bold truncate">
                  {res} <span className="text-cyan-400 text-[10px]">{u.symbol}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
