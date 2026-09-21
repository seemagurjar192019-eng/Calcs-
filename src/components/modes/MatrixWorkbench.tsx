import React, { useState } from 'react';
import { MatrixEngine, Matrix } from '../../engine/matrices';

export const MatrixWorkbench: React.FC = () => {
  const [size, setSize] = useState<2 | 3>(2);
  const [matrixA, setMatrixA] = useState<Matrix>([
    [2, 1],
    [1, 3],
  ]);
  const [matrixB, setMatrixB] = useState<Matrix>([
    [1, 0],
    [0, 1],
  ]);
  const [resultMatrix, setResultMatrix] = useState<Matrix | null>(null);
  const [scalarResult, setScalarResult] = useState<number | null>(null);
  const [elimSteps, setElimSteps] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSizeChange = (newSize: 2 | 3) => {
    setSize(newSize);
    if (newSize === 2) {
      setMatrixA([
        [2, 1],
        [1, 3],
      ]);
      setMatrixB([
        [1, 0],
        [0, 1],
      ]);
    } else {
      setMatrixA([
        [1, 2, 0],
        [0, 1, 1],
        [2, 0, 1],
      ]);
      setMatrixB([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ]);
    }
    setResultMatrix(null);
    setScalarResult(null);
    setElimSteps([]);
    setErrorMsg(null);
  };

  const updateCell = (target: 'A' | 'B', r: number, c: number, valStr: string) => {
    const num = parseFloat(valStr) || 0;
    if (target === 'A') {
      const next = matrixA.map((row, i) =>
        row.map((val, j) => (i === r && j === c ? num : val))
      );
      setMatrixA(next);
    } else {
      const next = matrixB.map((row, i) =>
        row.map((val, j) => (i === r && j === c ? num : val))
      );
      setMatrixB(next);
    }
  };

  const executeOp = (op: string) => {
    setErrorMsg(null);
    setScalarResult(null);
    setResultMatrix(null);
    setElimSteps([]);

    try {
      switch (op) {
        case 'add':
          setResultMatrix(MatrixEngine.add(matrixA, matrixB));
          break;
        case 'sub':
          setResultMatrix(MatrixEngine.subtract(matrixA, matrixB));
          break;
        case 'mul':
          setResultMatrix(MatrixEngine.multiply(matrixA, matrixB));
          break;
        case 'detA':
          setScalarResult(MatrixEngine.determinant(matrixA));
          break;
        case 'invA':
          setResultMatrix(MatrixEngine.inverse(matrixA));
          break;
        case 'transA':
          setResultMatrix(MatrixEngine.transpose(matrixA));
          break;
        case 'traceA':
          setScalarResult(MatrixEngine.trace(matrixA));
          break;
        case 'rankA':
          setScalarResult(MatrixEngine.rank(matrixA));
          break;
        case 'gaussA': {
          const res = MatrixEngine.gaussianEliminationSteps(matrixA);
          setResultMatrix(res.rref);
          setElimSteps(res.steps);
          break;
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Matrix calculation error');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Dimension Selector Toolbar */}
      <div className="flex items-center justify-between p-3 rounded-2xl mat-1 border border-white/10">
        <span className="text-sm font-semibold text-white">Square Dimension:</span>
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => handleSizeChange(2)}
            className={`px-3 py-1 rounded-lg text-xs font-mono-tech transition-colors cursor-pointer ${
              size === 2 ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400'
            }`}
          >
            2 × 2
          </button>
          <button
            onClick={() => handleSizeChange(3)}
            className={`px-3 py-1 rounded-lg text-xs font-mono-tech transition-colors cursor-pointer ${
              size === 3 ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400'
            }`}
          >
            3 × 3
          </button>
        </div>
      </div>

      {/* Matrices A and B side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Matrix A */}
        <div className="p-4 rounded-2xl mat-2 border border-white/10 flex flex-col gap-2">
          <span className="text-xs font-mono-tech font-bold text-cyan-400">Matrix A</span>
          <div className="flex flex-col gap-2 p-2 bg-slate-900/60 rounded-xl border border-white/5">
            {matrixA.map((row, r) => (
              <div key={r} className="flex gap-2">
                {row.map((val, c) => (
                  <input
                    key={c}
                    type="number"
                    value={val}
                    onChange={(e) => updateCell('A', r, c, e.target.value)}
                    className="w-full bg-slate-800/90 text-center text-sm font-mono-tech text-white py-2 rounded-lg border border-white/10 focus:border-cyan-500 focus:outline-none"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Matrix B */}
        <div className="p-4 rounded-2xl mat-2 border border-white/10 flex flex-col gap-2">
          <span className="text-xs font-mono-tech font-bold text-emerald-400">Matrix B</span>
          <div className="flex flex-col gap-2 p-2 bg-slate-900/60 rounded-xl border border-white/5">
            {matrixB.map((row, r) => (
              <div key={r} className="flex gap-2">
                {row.map((val, c) => (
                  <input
                    key={c}
                    type="number"
                    value={val}
                    onChange={(e) => updateCell('B', r, c, e.target.value)}
                    className="w-full bg-slate-800/90 text-center text-sm font-mono-tech text-white py-2 rounded-lg border border-white/10 focus:border-emerald-500 focus:outline-none"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operation Actions */}
      <div className="p-3 rounded-2xl mat-1 border border-white/10 flex flex-wrap gap-2 text-xs font-mono-tech">
        <button
          onClick={() => executeOp('add')}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer border border-white/5"
        >
          A + B
        </button>
        <button
          onClick={() => executeOp('sub')}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer border border-white/5"
        >
          A − B
        </button>
        <button
          onClick={() => executeOp('mul')}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold cursor-pointer border border-cyan-500/20"
        >
          A × B
        </button>
        <button
          onClick={() => executeOp('detA')}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold cursor-pointer border border-white/5"
        >
          det(A)
        </button>
        <button
          onClick={() => executeOp('invA')}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-semibold cursor-pointer border border-white/5"
        >
          A⁻¹ (Inverse)
        </button>
        <button
          onClick={() => executeOp('transA')}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer border border-white/5"
        >
          Aᵀ (Transpose)
        </button>
        <button
          onClick={() => executeOp('rankA')}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer border border-white/5"
        >
          rank(A)
        </button>
        <button
          onClick={() => executeOp('traceA')}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer border border-white/5"
        >
          trace(A)
        </button>
        <button
          onClick={() => executeOp('gaussA')}
          className="px-3 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/70 text-cyan-300 border border-cyan-500/40 font-bold cursor-pointer"
        >
          Gauss-Jordan (RREF)
        </button>
      </div>

      {/* Error display */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs font-mono-tech">
          {errorMsg}
        </div>
      )}

      {/* Result Display */}
      {(resultMatrix || scalarResult !== null) && (
        <div className="p-4 rounded-2xl mat-2 border border-white/10 flex flex-col gap-3">
          <span className="text-xs font-mono-tech font-bold text-cyan-400">Result</span>

          {scalarResult !== null && (
            <div className="text-2xl font-mono-tech font-bold text-white">
              = {scalarResult}
            </div>
          )}

          {resultMatrix && (
            <div className="flex flex-col gap-2 p-3 bg-slate-950/70 rounded-xl border border-white/5 max-w-sm">
              {resultMatrix.map((row, i) => (
                <div key={i} className="flex justify-around gap-2 text-sm font-mono-tech text-white">
                  {row.map((v, j) => (
                    <span key={j} className="w-16 text-center py-1 bg-slate-900/80 rounded border border-white/5">
                      {v}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Steps */}
          {elimSteps.length > 0 && (
            <div className="flex flex-col gap-1 mt-2 pt-2 border-t border-white/5">
              <span className="text-xs text-slate-400 font-semibold">Row Transformation Steps:</span>
              <ul className="text-xs text-slate-300 font-mono-tech list-disc list-inside flex flex-col gap-1">
                {elimSteps.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
