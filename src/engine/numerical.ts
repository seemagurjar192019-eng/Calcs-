/**
 * Numerical Methods Engine
 * Root finding via Newton-Raphson, Bisection, and Secant methods with step iteration records
 */

import { ExpressionParser } from './parser';
import { cleanFloat } from './precision';

export interface IterationStep {
  iteration: number;
  x: number;
  fx: number;
  error: number;
}

export class NumericalMethods {
  /**
   * Newton-Raphson Method
   */
  static newtonRaphson(
    expr: string,
    initialGuess: number,
    tolerance: number = 1e-7,
    maxIter: number = 50
  ): { root: number; iterations: IterationStep[]; converged: boolean } {
    const parser = new ExpressionParser('RAD');
    const f = (x: number) => {
      parser.setVariables({ x });
      return parser.evaluate(expr);
    };

    const df = (x: number) => {
      const h = 1e-6;
      return (f(x + h) - f(x - h)) / (2 * h);
    };

    let x = initialGuess;
    const iterations: IterationStep[] = [];
    let converged = false;

    for (let i = 0; i < maxIter; i++) {
      const fx = f(x);
      const dfx = df(x);
      if (Math.abs(dfx) < 1e-12) break; // Derivative too small

      const nextX = x - fx / dfx;
      const error = Math.abs(nextX - x);
      iterations.push({
        iteration: i + 1,
        x: cleanFloat(x, 6),
        fx: cleanFloat(fx, 6),
        error: cleanFloat(error, 8),
      });

      x = nextX;
      if (error < tolerance) {
        converged = true;
        break;
      }
    }

    return { root: cleanFloat(x, 6), iterations, converged };
  }

  /**
   * Bisection Method
   */
  static bisection(
    expr: string,
    a: number,
    b: number,
    tolerance: number = 1e-7,
    maxIter: number = 50
  ): { root: number; iterations: IterationStep[]; converged: boolean } {
    const parser = new ExpressionParser('RAD');
    const f = (x: number) => {
      parser.setVariables({ x });
      return parser.evaluate(expr);
    };

    let fa = f(a);
    let fb = f(b);

    if (fa * fb > 0) {
      throw new Error(`f(a) and f(b) must have opposite signs. f(${a})=${fa}, f(${b})=${fb}`);
    }

    const iterations: IterationStep[] = [];
    let c = a;
    let converged = false;

    for (let i = 0; i < maxIter; i++) {
      c = (a + b) / 2;
      const fc = f(c);
      const error = Math.abs(b - a) / 2;

      iterations.push({
        iteration: i + 1,
        x: cleanFloat(c, 6),
        fx: cleanFloat(fc, 6),
        error: cleanFloat(error, 8),
      });

      if (error < tolerance || Math.abs(fc) < 1e-12) {
        converged = true;
        break;
      }

      if (fa * fc < 0) {
        b = c;
        fb = fc;
      } else {
        a = c;
        fa = fc;
      }
    }

    return { root: cleanFloat(c, 6), iterations, converged };
  }
}
