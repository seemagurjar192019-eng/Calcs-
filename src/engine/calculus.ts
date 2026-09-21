/**
 * Calculus Studio Engine
 * Derivatives (central difference), Definite Integrals (Simpson's Rule & Trapezoidal Rule),
 * Riemann sums (left, right, midpoint), Tangent Line calculator, Limit Analyzer
 */

import { ExpressionParser } from './parser';
import { cleanFloat } from './precision';

export class CalculusEngine {
  /**
   * Numerical Derivative using 5-point central difference stencil
   */
  static derivative(expr: string, xVal: number, h: number = 1e-5): number {
    const parser = new ExpressionParser('RAD');
    const f = (x: number) => {
      parser.setVariables({ x });
      return parser.evaluate(expr);
    };

    // 5-point stencil: (-f(x+2h) + 8f(x+h) - 8f(x-h) + f(x-2h)) / (12h)
    const d = (-f(xVal + 2 * h) + 8 * f(xVal + h) - 8 * f(xVal - h) + f(xVal - 2 * h)) / (12 * h);
    return cleanFloat(d, 8);
  }

  /**
   * Tangent line equation y = mx + c at x = a
   */
  static tangentLine(expr: string, a: number): { slope: number; intercept: number; equation: string } {
    const parser = new ExpressionParser('RAD');
    parser.setVariables({ x: a });
    const yVal = parser.evaluate(expr);
    const m = this.derivative(expr, a);
    const c = cleanFloat(yVal - m * a);
    const eq = `y = ${m}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)}`;
    return { slope: m, intercept: c, equation: eq };
  }

  /**
   * Definite Integral using Composite Simpson's 1/3 Rule
   */
  static simpsonsRule(expr: string, a: number, b: number, n: number = 1000): number {
    if (n % 2 !== 0) n += 1;
    const h = (b - a) / n;
    const parser = new ExpressionParser('RAD');
    const f = (x: number) => {
      parser.setVariables({ x });
      return parser.evaluate(expr);
    };

    let sum = f(a) + f(b);
    for (let i = 1; i < n; i++) {
      const x = a + i * h;
      sum += (i % 2 === 0 ? 2 : 4) * f(x);
    }
    return cleanFloat((h / 3) * sum, 8);
  }

  /**
   * Definite Integral using Trapezoidal Rule
   */
  static trapezoidalRule(expr: string, a: number, b: number, n: number = 1000): number {
    const h = (b - a) / n;
    const parser = new ExpressionParser('RAD');
    const f = (x: number) => {
      parser.setVariables({ x });
      return parser.evaluate(expr);
    };

    let sum = (f(a) + f(b)) / 2;
    for (let i = 1; i < n; i++) {
      sum += f(a + i * h);
    }
    return cleanFloat(h * sum, 8);
  }

  /**
   * Riemann Sums (Left, Right, Midpoint)
   */
  static riemannSum(
    expr: string,
    a: number,
    b: number,
    n: number = 20,
    type: 'left' | 'right' | 'mid' = 'mid'
  ): { value: number; rectangles: { x: number; width: number; height: number }[] } {
    const width = (b - a) / n;
    const parser = new ExpressionParser('RAD');
    const f = (x: number) => {
      parser.setVariables({ x });
      return parser.evaluate(expr);
    };

    let total = 0;
    const rectangles: { x: number; width: number; height: number }[] = [];

    for (let i = 0; i < n; i++) {
      const x0 = a + i * width;
      let sampleX = x0;
      if (type === 'right') sampleX = x0 + width;
      if (type === 'mid') sampleX = x0 + width / 2;

      const height = f(sampleX);
      total += height * width;
      rectangles.push({ x: x0, width, height });
    }

    return { value: cleanFloat(total, 6), rectangles };
  }

  /**
   * Numerical Limit Analyzer: Left limit, Right limit, and approach table
   */
  static analyzeLimit(expr: string, targetX: number): {
    leftLimit: number;
    rightLimit: number;
    isContinuous: boolean;
    table: { delta: number; xLeft: number; yLeft: number; xRight: number; yRight: number }[];
  } {
    const parser = new ExpressionParser('RAD');
    const f = (x: number) => {
      try {
        parser.setVariables({ x });
        return parser.evaluate(expr);
      } catch {
        return NaN;
      }
    };

    const deltas = [0.1, 0.01, 0.001, 0.0001, 0.00001];
    const table = deltas.map((delta) => {
      const xLeft = targetX - delta;
      const yLeft = cleanFloat(f(xLeft), 6);
      const xRight = targetX + delta;
      const yRight = cleanFloat(f(xRight), 6);
      return { delta, xLeft, yLeft, xRight, yRight };
    });

    const leftLimit = table[table.length - 1].yLeft;
    const rightLimit = table[table.length - 1].yRight;
    const isContinuous = Math.abs(leftLimit - rightLimit) < 1e-4 && !Number.isNaN(leftLimit);

    return { leftLimit, rightLimit, isContinuous, table };
  }
}
