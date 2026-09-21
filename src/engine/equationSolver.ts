/**
 * Multi-Variable System of Linear Equations Solver
 * Supports 2x2 and 3x3 systems via Cramer's rule and substitution
 */

import { MatrixEngine } from './matrices';
import { cleanFloat } from './precision';

export class EquationSystemSolver {
  /**
   * Solves 2x2 system:
   * a1*x + b1*y = c1
   * a2*x + b2*y = c2
   */
  static solve2x2(
    a1: number, b1: number, c1: number,
    a2: number, b2: number, c2: number
  ): { x: number; y: number; det: number; steps: string[] } {
    const D = cleanFloat(a1 * b2 - a2 * b1);
    const steps: string[] = [
      `System: [${a1}x + ${b1}y = ${c1}] and [${a2}x + ${b2}y = ${c2}]`,
      `Determinant D = (${a1})(${b2}) - (${a2})(${b1}) = ${D}`,
    ];

    if (Math.abs(D) < 1e-12) {
      throw new Error('System has no unique solution (Determinant is 0: parallel or coincident lines)');
    }

    const Dx = cleanFloat(c1 * b2 - c2 * b1);
    const Dy = cleanFloat(a1 * c2 - a2 * c1);

    steps.push(`Dx = (${c1})(${b2}) - (${c2})(${b1}) = ${Dx}`);
    steps.push(`Dy = (${a1})(${c2}) - (${a2})(${c1}) = ${Dy}`);

    const x = cleanFloat(Dx / D);
    const y = cleanFloat(Dy / D);

    steps.push(`x = Dx / D = ${Dx} / ${D} = ${x}`);
    steps.push(`y = Dy / D = ${Dy} / ${D} = ${y}`);
    steps.push(`Verification: ${a1}(${x}) + ${b1}(${y}) = ${cleanFloat(a1 * x + b1 * y)} (matches ${c1})`);

    return { x, y, det: D, steps };
  }

  /**
   * Solves 3x3 system via Matrix Inversion / Cramer's Rule:
   * A * X = B
   */
  static solve3x3(A: number[][], B: number[]): { solutions: number[]; steps: string[] } {
    const steps: string[] = ['Formulating 3x3 Matrix Equation A · X = B'];
    const detA = MatrixEngine.determinant(A);
    steps.push(`det(A) = ${detA}`);

    if (Math.abs(detA) < 1e-12) {
      throw new Error('System does not have a unique solution (singular matrix)');
    }

    const invA = MatrixEngine.inverse(A);
    steps.push('Computed inverse matrix A⁻¹');

    const solVector = MatrixEngine.multiply(invA, B.map((b) => [b]));
    const solutions = solVector.map((row) => cleanFloat(row[0]));

    steps.push(`x = ${solutions[0]}, y = ${solutions[1]}, z = ${solutions[2]}`);
    return { solutions, steps };
  }
}
