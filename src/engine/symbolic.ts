/**
 * Symbolic Algebra and Polynomial Lab Engine
 * Structured polynomial and term representation, degree calculation,
 * symbolic expansion, differentiation, integration, root finding, and factorizations
 */

import { cleanFloat } from './precision';

export interface PolyTerm {
  coeff: number;
  power: number;
}

export class Polynomial {
  terms: PolyTerm[]; // sorted in descending order of power

  constructor(terms: PolyTerm[]) {
    // Combine like terms
    const map = new Map<number, number>();
    for (const t of terms) {
      map.set(t.power, (map.get(t.power) || 0) + t.coeff);
    }

    this.terms = [];
    for (const [power, coeff] of map.entries()) {
      if (Math.abs(coeff) > 1e-12) {
        this.terms.push({ power, coeff: cleanFloat(coeff) });
      }
    }

    this.terms.sort((a, b) => b.power - a.power);
    if (this.terms.length === 0) {
      this.terms = [{ coeff: 0, power: 0 }];
    }
  }

  static fromCoefficients(coeffs: number[]): Polynomial {
    // coeffs: [a_n, a_{n-1}, ..., a_0]
    const deg = coeffs.length - 1;
    const terms = coeffs.map((c, i) => ({ coeff: c, power: deg - i }));
    return new Polynomial(terms);
  }

  getDegree(): number {
    return this.terms[0]?.power ?? 0;
  }

  getCoefficient(power: number): number {
    const term = this.terms.find((t) => t.power === power);
    return term ? term.coeff : 0;
  }

  evaluate(x: number): number {
    let sum = 0;
    for (const t of this.terms) {
      sum += t.coeff * Math.pow(x, t.power);
    }
    return cleanFloat(sum);
  }

  add(other: Polynomial): Polynomial {
    return new Polynomial([...this.terms, ...other.terms]);
  }

  subtract(other: Polynomial): Polynomial {
    const neg = other.terms.map((t) => ({ coeff: -t.coeff, power: t.power }));
    return new Polynomial([...this.terms, ...neg]);
  }

  multiply(other: Polynomial): Polynomial {
    const newTerms: PolyTerm[] = [];
    for (const t1 of this.terms) {
      for (const t2 of other.terms) {
        newTerms.push({
          coeff: t1.coeff * t2.coeff,
          power: t1.power + t2.power,
        });
      }
    }
    return new Polynomial(newTerms);
  }

  derivative(): Polynomial {
    const dTerms: PolyTerm[] = [];
    for (const t of this.terms) {
      if (t.power > 0) {
        dTerms.push({ coeff: t.coeff * t.power, power: t.power - 1 });
      }
    }
    return new Polynomial(dTerms);
  }

  integral(constantC: number = 0): Polynomial {
    const iTerms: PolyTerm[] = [];
    for (const t of this.terms) {
      iTerms.push({ coeff: t.coeff / (t.power + 1), power: t.power + 1 });
    }
    if (constantC !== 0) {
      iTerms.push({ coeff: constantC, power: 0 });
    }
    return new Polynomial(iTerms);
  }

  discriminant(): number | null {
    if (this.getDegree() === 2) {
      const a = this.getCoefficient(2);
      const b = this.getCoefficient(1);
      const c = this.getCoefficient(0);
      return cleanFloat(b * b - 4 * a * c);
    }
    return null;
  }

  findRoots(): { real: number[]; complex?: string[] } {
    const deg = this.getDegree();

    if (deg === 1) {
      const a = this.getCoefficient(1);
      const b = this.getCoefficient(0);
      return { real: [cleanFloat(-b / a)] };
    }

    if (deg === 2) {
      const a = this.getCoefficient(2);
      const b = this.getCoefficient(1);
      const c = this.getCoefficient(0);
      const disc = b * b - 4 * a * c;

      if (disc > 0) {
        const r1 = (-b + Math.sqrt(disc)) / (2 * a);
        const r2 = (-b - Math.sqrt(disc)) / (2 * a);
        return { real: [cleanFloat(r1), cleanFloat(r2)] };
      } else if (Math.abs(disc) < 1e-12) {
        return { real: [cleanFloat(-b / (2 * a))] };
      } else {
        const realPart = cleanFloat(-b / (2 * a));
        const imPart = cleanFloat(Math.sqrt(-disc) / (2 * a));
        return {
          real: [],
          complex: [`${realPart} + ${imPart}i`, `${realPart} - ${imPart}i`],
        };
      }
    }

    // Numerical companion matrix or Newton-Raphson approximation for higher degrees
    const roots: number[] = [];
    for (let guess = -10; guess <= 10; guess += 0.5) {
      let x = guess;
      for (let iter = 0; iter < 30; iter++) {
        const fx = this.evaluate(x);
        const dfx = this.derivative().evaluate(x);
        if (Math.abs(dfx) < 1e-10) break;
        const nextX = x - fx / dfx;
        if (Math.abs(nextX - x) < 1e-6) {
          const rounded = cleanFloat(nextX, 4);
          if (!roots.some((r) => Math.abs(r - rounded) < 1e-3)) {
            roots.push(rounded);
          }
          break;
        }
        x = nextX;
      }
    }
    return { real: roots.sort((a, b) => a - b) };
  }

  toString(varName: string = 'x'): string {
    if (this.terms.length === 0 || (this.terms.length === 1 && this.terms[0].coeff === 0)) {
      return '0';
    }

    const parts: string[] = [];
    for (let i = 0; i < this.terms.length; i++) {
      const t = this.terms[i];
      let termStr = '';
      const absCoeff = Math.abs(t.coeff);
      const sign = t.coeff < 0 ? (i === 0 ? '-' : ' - ') : (i === 0 ? '' : ' + ');

      if (t.power === 0) {
        termStr = `${absCoeff}`;
      } else {
        const coeffPart = absCoeff === 1 ? '' : `${absCoeff}`;
        const powPart = t.power === 1 ? varName : `${varName}^${t.power}`;
        termStr = `${coeffPart}${powPart}`;
      }

      parts.push(`${sign}${termStr}`);
    }

    return parts.join('');
  }
}
