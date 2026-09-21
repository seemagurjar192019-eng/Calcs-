import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ExpressionParser } from '../../engine/parser';
import { ZoomIn, ZoomOut, RotateCcw, Crosshair, Eye } from 'lucide-react';

interface GraphingLabProps {
  initialExpr?: string;
}

export const GraphingLab: React.FC<GraphingLabProps> = ({ initialExpr = 'sin(x)' }) => {
  const [func1, setFunc1] = useState(initialExpr);
  const [func2, setFunc2] = useState('cos(x)');
  const [showFunc2, setShowFunc2] = useState(false);
  const [rangeX, setRangeX] = useState<[number, number]>([-10, 10]);
  const [rangeY, setRangeY] = useState<[number, number]>([-5, 5]);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const presets = [
    { label: 'Sine Wave', expr: 'sin(x)' },
    { label: 'Quadratic Parabola', expr: 'x^2 - 4' },
    { label: 'Cubic Polynomial', expr: 'x^3 - 3*x' },
    { label: 'Gaussian Bell', expr: 'exp(-x^2)' },
    { label: 'Damped Oscillator', expr: 'exp(-0.2*x)*sin(2*x)' },
    { label: 'Rational Function', expr: '1 / (x^2 + 1)' },
  ];

  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, width, height);

    const [xMin, xMax] = rangeX;
    const [yMin, yMax] = rangeY;

    const toCanvasX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
    const toCanvasY = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;
    const toMathX = (cx: number) => xMin + (cx / width) * (xMax - xMin);

    // Grid lines
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = '10px "JetBrains Mono", monospace';

    const stepX = Math.pow(10, Math.floor(Math.log10((xMax - xMin) / 5)));
    const startX = Math.ceil(xMin / stepX) * stepX;
    for (let x = startX; x <= xMax; x += stepX) {
      const cx = toCanvasX(x);
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, height);
      ctx.stroke();

      if (Math.abs(x) > 1e-6) {
        ctx.fillText(x.toFixed(x < 1 && x > -1 ? 2 : 0), cx + 3, height - 6);
      }
    }

    const stepY = Math.pow(10, Math.floor(Math.log10((yMax - yMin) / 5)));
    const startY = Math.ceil(yMin / stepY) * stepY;
    for (let y = startY; y <= yMax; y += stepY) {
      const cy = toCanvasY(y);
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(width, cy);
      ctx.stroke();

      if (Math.abs(y) > 1e-6) {
        ctx.fillText(y.toFixed(y < 1 && y > -1 ? 2 : 0), 6, cy - 3);
      }
    }

    // Axes
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    const originX = toCanvasX(0);
    const originY = toCanvasY(0);

    // Y axis
    if (originX >= 0 && originX <= width) {
      ctx.beginPath();
      ctx.moveTo(originX, 0);
      ctx.lineTo(originX, height);
      ctx.stroke();
    }

    // X axis
    if (originY >= 0 && originY <= height) {
      ctx.beginPath();
      ctx.moveTo(0, originY);
      ctx.lineTo(width, originY);
      ctx.stroke();
    }

    // Render Curves
    const parser = new ExpressionParser('RAD');

    const plotFunction = (expr: string, color: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      let isDrawing = false;

      for (let px = 0; px < width; px += 2) {
        const mathX = toMathX(px);
        try {
          parser.setVariables({ x: mathX });
          const mathY = parser.evaluate(expr);

          if (!Number.isFinite(mathY) || Math.abs(mathY) > 1e4) {
            isDrawing = false;
            continue;
          }

          const py = toCanvasY(mathY);
          if (!isDrawing) {
            ctx.moveTo(px, py);
            isDrawing = true;
          } else {
            ctx.lineTo(px, py);
          }
        } catch {
          isDrawing = false;
        }
      }
      ctx.stroke();
    };

    if (func1.trim()) plotFunction(func1, '#38bdf8'); // Cyan
    if (showFunc2 && func2.trim()) plotFunction(func2, '#10b981'); // Emerald

    // Draw Crosshair if hovering
    if (cursorPos) {
      const cx = toCanvasX(cursorPos.x);
      const cy = toCanvasY(cursorPos.y);

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(cx, 0); ctx.lineTo(cx, height);
      ctx.moveTo(0, cy); ctx.lineTo(width, cy);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [func1, func2, showFunc2, rangeX, rangeY, cursorPos]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  // Canvas Mouse Controls (Pan & Zoom)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    const mathX = rangeX[0] + (cx / canvas.width) * (rangeX[1] - rangeX[0]);
    let mathY = 0;
    try {
      const parser = new ExpressionParser('RAD');
      parser.setVariables({ x: mathX });
      mathY = parser.evaluate(func1);
    } catch {}

    setCursorPos({ x: mathX, y: mathY });

    if (isDragging.current) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      dragStart.current = { x: e.clientX, y: e.clientY };

      const scaleX = (rangeX[1] - rangeX[0]) / canvas.width;
      const scaleY = (rangeY[1] - rangeY[0]) / canvas.height;

      setRangeX(([min, max]) => [min - dx * scaleX, max - dx * scaleX]);
      setRangeY(([min, max]) => [min + dy * scaleY, max + dy * scaleY]);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleZoom = (factor: number) => {
    setRangeX(([min, max]) => {
      const mid = (min + max) / 2;
      const span = (max - min) * factor;
      return [mid - span / 2, mid + span / 2];
    });
    setRangeY(([min, max]) => {
      const mid = (min + max) / 2;
      const span = (max - min) * factor;
      return [mid - span / 2, mid + span / 2];
    });
  };

  const handleResetView = () => {
    setRangeX([-10, 10]);
    setRangeY([-5, 5]);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Function Inputs & Presets */}
      <div className="p-4 rounded-2xl mat-1 border border-white/10 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* f1(x) input */}
          <div className="flex-1 w-full flex items-center gap-2 bg-slate-900/90 px-3 py-2 rounded-xl border border-cyan-500/30">
            <span className="font-mono-tech font-bold text-xs text-cyan-400 whitespace-nowrap">f₁(x) =</span>
            <input
              type="text"
              value={func1}
              onChange={(e) => setFunc1(e.target.value)}
              className="bg-transparent text-sm text-white font-mono-tech focus:outline-none w-full"
              placeholder="e.g. sin(x) or x^2 - 4"
            />
          </div>

          {/* Toggle f2 */}
          <button
            onClick={() => setShowFunc2(!showFunc2)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              showFunc2
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900/80 text-slate-400 border-white/5'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Add Curve</span>
          </button>
        </div>

        {/* f2(x) if active */}
        {showFunc2 && (
          <div className="w-full flex items-center gap-2 bg-slate-900/90 px-3 py-2 rounded-xl border border-emerald-500/30">
            <span className="font-mono-tech font-bold text-xs text-emerald-400 whitespace-nowrap">f₂(x) =</span>
            <input
              type="text"
              value={func2}
              onChange={(e) => setFunc2(e.target.value)}
              className="bg-transparent text-sm text-white font-mono-tech focus:outline-none w-full"
              placeholder="e.g. cos(x)"
            />
          </div>
        )}

        {/* Preset curve chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 text-[11px] whitespace-nowrap">Presets:</span>
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => setFunc1(p.expr)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-white/5 whitespace-nowrap cursor-pointer transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas Area with Floating Viewport Controls */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-[#0a0e1a]">
        <canvas
          ref={canvasRef}
          width={800}
          height={420}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            handleMouseUp();
            setCursorPos(null);
          }}
          className="w-full h-[320px] sm:h-[420px] cursor-crosshair touch-none"
        />

        {/* Floating Viewport Controls */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-md">
          <button
            onClick={() => handleZoom(0.8)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(1.25)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Coordinates Readout */}
        {cursorPos && (
          <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono-tech text-cyan-300 flex items-center gap-2">
            <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
            <span>x: {cursorPos.x.toFixed(3)}</span>
            <span className="text-slate-500">|</span>
            <span>y: {cursorPos.y.toFixed(3)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
