/**
 * Step-by-Step Mathematical Problem Solver
 * Generates transparent algebraic derivation steps with formal justifications
 */

import { cleanFloat } from './precision';

export interface SolutionStep {
  stepNumber: number;
  expression: string;
  explanation: string;
}

export class StepSolver {
  /**
   * Solves linear equation: ax + b = c
   */
  static solveLinear(a: number, b: number, c: number, varName: string = 'x'): { steps: SolutionStep[]; solution: number } {
    const steps: SolutionStep[] = [];
    let step = 1;

    const originalEq = `${a !== 1 ? a : ''}${varName} ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${c}`;
    steps.push({
      stepNumber: step++,
      expression: originalEq,
      explanation: 'Given linear equation',
    });

    if (b !== 0) {
      const cAfterSub = c - b;
      steps.push({
        stepNumber: step++,
        expression: `${a !== 1 ? a : ''}${varName} = ${c} ${b > 0 ? '-' : '+'} ${Math.abs(b)}`,
        explanation: `Subtract ${b} from both sides`,
      });
      steps.push({
        stepNumber: step++,
        expression: `${a !== 1 ? a : ''}${varName} = ${cAfterSub}`,
        explanation: 'Simplify right-hand side',
      });
      c = cAfterSub;
    }

    if (a !== 1) {
      const finalVal = cleanFloat(c / a);
      steps.push({
        stepNumber: step++,
        expression: `${varName} = ${c} / ${a}`,
        explanation: `Divide both sides by ${a}`,
      });
      steps.push({
        stepNumber: step++,
        expression: `${varName} = ${finalVal}`,
        explanation: 'Evaluate final solution',
      });
      return { steps, solution: finalVal };
    }

    return { steps, solution: c };
  }

  /**
   * Solves quadratic equation: ax^2 + bx + c = 0
   */
  static solveQuadratic(a: number, b: number, c: number, varName: string = 'x'): { steps: SolutionStep[]; roots: number[] } {
    const steps: SolutionStep[] = [];
    let step = 1;

    steps.push({
      stepNumber: step++,
      expression: `${a !== 1 ? a : ''}${varName}² ${b >= 0 ? '+' : '-'} ${Math.abs(b)}${varName} ${c >= 0 ? '+' : '-'} ${Math.abs(c)} = 0`,
      explanation: 'Standard quadratic form: ax² + bx + c = 0',
    });

    const disc = b * b - 4 * a * c;
    steps.push({
      stepNumber: step++,
      expression: `Δ = b² - 4ac = (${b})² - 4(${a})(${c})`,
      explanation: 'Calculate the discriminant Δ',
    });
    steps.push({
      stepNumber: step++,
      expression: `Δ = ${b * b} - ${4 * a * c} = ${disc}`,
      explanation: `Discriminant value is ${disc}`,
    });

    if (disc > 0) {
      const sqrtD = Math.sqrt(disc);
      steps.push({
        stepNumber: step++,
        expression: `√Δ = √${disc} = ${cleanFloat(sqrtD, 4)}`,
        explanation: 'Discriminant > 0, there are two distinct real roots',
      });

      const r1 = cleanFloat((-b + sqrtD) / (2 * a));
      const r2 = cleanFloat((-b - sqrtD) / (2 * a));

      steps.push({
        stepNumber: step++,
        expression: `${varName}₁ = (-(${b}) + ${cleanFloat(sqrtD, 4)}) / (2 · ${a}) = ${r1}`,
        explanation: 'First root via quadratic formula',
      });
      steps.push({
        stepNumber: step++,
        expression: `${varName}₂ = (-(${b}) - ${cleanFloat(sqrtD, 4)}) / (2 · ${a}) = ${r2}`,
        explanation: 'Second root via quadratic formula',
      });

      return { steps, roots: [r1, r2] };
    } else if (Math.abs(disc) < 1e-12) {
      const r = cleanFloat(-b / (2 * a));
      steps.push({
        stepNumber: step++,
        expression: `${varName} = -b / (2a) = -(${b}) / (2 · ${a}) = ${r}`,
        explanation: 'Discriminant = 0, exactly one repeated real root',
      });
      return { steps, roots: [r] };
    } else {
      steps.push({
        stepNumber: step++,
        expression: `Δ < 0 (${disc})`,
        explanation: 'Discriminant is negative; no real roots exist (complex conjugate roots)',
      });
      return { steps, roots: [] };
    }
  }
}
