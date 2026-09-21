import React, { useState, useEffect } from 'react';
import { ExpressionParser } from '../../engine/parser';
import { Download, RefreshCw, Copy, Check } from 'lucide-react';

interface NotebookLine {
  id: string;
  raw: string;
  result: string;
  isError: boolean;
}

export const NotebookLab: React.FC = () => {
  const initialText = `// Technical Scratchpad - Reactive variables
a = 15
b = 20
c = sqrt(a^2 + b^2)
ratio = c / (a + b)
finalValue = ratio * 100`;

  const [rawCode, setRawCode] = useState(initialText);
  const [evaluatedLines, setEvaluatedLines] = useState<NotebookLine[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const lines = rawCode.split('\n');
    const parser = new ExpressionParser('RAD');
    const envVars: Record<string, number> = {};

    const computed: NotebookLine[] = lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('//')) {
        return { id: String(idx), raw: line, result: '', isError: false };
      }

      // Check for assignment: variable = expression
      const assignMatch = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/);

      try {
        parser.setVariables(envVars);

        if (assignMatch) {
          const varName = assignMatch[1];
          const expr = assignMatch[2];
          const val = parser.evaluate(expr);
          envVars[varName] = val;
          return { id: String(idx), raw: line, result: `= ${val}`, isError: false };
        } else {
          const val = parser.evaluate(trimmed);
          return { id: String(idx), raw: line, result: `= ${val}`, isError: false };
        }
      } catch (err: any) {
        return { id: String(idx), raw: line, result: `error: ${err.message || 'invalid'}`, isError: true };
      }
    });

    setEvaluatedLines(computed);
  }, [rawCode]);

  const copyMarkdown = () => {
    const md = evaluatedLines
      .map((l) => (l.result ? `${l.raw.padEnd(30, ' ')} ${l.result}` : l.raw))
      .join('\n');
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const exportMarkdownFile = () => {
    const md = evaluatedLines
      .map((l) => (l.result ? `${l.raw.padEnd(30, ' ')} ${l.result}` : l.raw))
      .join('\n');
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `math_notebook_${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 rounded-2xl mat-2 border border-white/10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono-tech font-bold text-cyan-400">
            Reactive Math Notebook / REPL
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={copyMarkdown}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={exportMarkdownFile}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .md</span>
            </button>
          </div>
        </div>

        {/* Dual Pane or Split Editor / Output */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Left: Input Code */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-500 font-mono-tech">Editable Lines (variables propagate downward):</span>
            <textarea
              value={rawCode}
              onChange={(e) => setRawCode(e.target.value)}
              rows={10}
              className="w-full h-64 p-3 bg-slate-900/90 text-sm font-mono-tech text-white rounded-xl border border-white/10 focus:border-cyan-500 focus:outline-none resize-none"
              spellCheck={false}
            />
          </div>

          {/* Right: Real-time Evaluated Results */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-500 font-mono-tech">Reactive Result Stream:</span>
            <div className="w-full h-64 p-3 bg-slate-950/80 rounded-xl border border-white/10 overflow-y-auto flex flex-col font-mono-tech text-sm">
              {evaluatedLines.map((line) => (
                <div key={line.id} className="h-6 flex items-center justify-between">
                  <span className="text-slate-500 text-xs truncate">{line.raw || ' '}</span>
                  <span
                    className={`text-xs font-bold ${
                      line.isError ? 'text-rose-400' : 'text-cyan-300'
                    }`}
                  >
                    {line.result}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
