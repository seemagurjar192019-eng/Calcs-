/**
 * Calculation Macro Builder Engine
 * Sequentially applies recorded operations on input values safely
 */

import { cleanFloat } from './precision';
import { Macro, MacroStep } from '../types';
import { ExpressionParser } from './parser';

export interface MacroExecutionResult {
  finalValue: number;
  stepOutputs: { stepIndex: number; expression: string; value: number }[];
}

export class MacroEngine {
  static execute(macro: Macro, initialValue: number): { finalValue: number; stepResults: { step: MacroStep; value: number }[] } {
    let current = initialValue;
    const stepResults: { step: MacroStep; value: number }[] = [];

    for (const step of macro.steps) {
      switch (step.action) {
        case 'add':
          current = current + step.value;
          break;
        case 'subtract':
          current = current - step.value;
          break;
        case 'multiply':
          current = current * step.value;
          break;
        case 'divide':
          if (step.value === 0) throw new Error('Cannot divide by zero in macro');
          current = current / step.value;
          break;
        case 'percent':
          current = (current * step.value) / 100;
          break;
        case 'tax':
          current = current * (1 + step.value / 100);
          break;
        case 'round':
          current = Math.round(current * Math.pow(10, step.value)) / Math.pow(10, step.value);
          break;
        case 'power':
          current = Math.pow(current, step.value);
          break;
      }
      current = cleanFloat(current, 8);
      stepResults.push({ step, value: current });
    }

    return { finalValue: current, stepResults };
  }

  static executeMacro(stepExprs: string[], initialValue: number): MacroExecutionResult {
    const parser = new ExpressionParser('RAD');
    let current = initialValue;
    const stepOutputs: { stepIndex: number; expression: string; value: number }[] = [];

    for (let i = 0; i < stepExprs.length; i++) {
      const expr = stepExprs[i];
      parser.setVariables({ val: current });
      const nextVal = parser.evaluate(expr);
      current = cleanFloat(nextVal, 8);
      stepOutputs.push({ stepIndex: i, expression: expr, value: current });
    }

    return { finalValue: current, stepOutputs };
  }
}
