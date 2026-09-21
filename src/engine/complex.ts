/**
 * Complex Number Studio Engine
 * Rectangular (a + bi), polar (r∠θ), modulus, argument, conjugate, Euler form (r*e^(iθ)), powers, roots
 */

import { cleanFloat } from './precision';

export class Complex {
  re: number;
  im: number;

  constructor(re: number = 0, im: number = 0) {
    this.re = cleanFloat(re);
    this.im = cleanFloat(im);
  }

  static fromPolar(r: number, thetaRad: number): Complex {
    return new Complex(r * Math.cos(thetaRad), r * Math.sin(thetaRad));
  }

  add(other: Complex): Complex {
    return new Complex(this.re + other.re, this.im + other.im);
  }

  subtract(other: Complex): Complex {
    return new Complex(this.re - other.re, this.im - other.im);
  }

  multiply(other: Complex): Complex {
    return new Complex(
      this.re * other.re - this.im * other.im,
      this.re * other.im + this.im * other.re
    );
  }

  divide(other: Complex): Complex {
    const denom = other.re * other.re + other.im * other.im;
    if (denom === 0) throw new Error('Complex division by zero');
    return new Complex(
      (this.re * other.re + this.im * other.im) / denom,
      (this.im * other.re - this.re * other.im) / denom
    );
  }

  modulus(): number {
    return cleanFloat(Math.sqrt(this.re * this.re + this.im * this.im));
  }

  argument(inDegrees: boolean = false): number {
    const rad = Math.atan2(this.im, this.re);
    return inDegrees ? cleanFloat((rad * 180) / Math.PI) : cleanFloat(rad);
  }

  conjugate(): Complex {
    return new Complex(this.re, -this.im);
  }

  pow(n: number): Complex {
    const r = this.modulus();
    const theta = this.argument(false);
    const newR = Math.pow(r, n);
    const newTheta = theta * n;
    return Complex.fromPolar(newR, newTheta);
  }

  roots(n: number): Complex[] {
    if (n <= 0) return [];
    const r = this.modulus();
    const theta = this.argument(false);
    const rRoot = Math.pow(r, 1 / n);
    const results: Complex[] = [];
    for (let k = 0; k < n; k++) {
      const angle = (theta + 2 * Math.PI * k) / n;
      results.push(Complex.fromPolar(rRoot, angle));
    }
    return results;
  }

  toRectangularString(): string {
    if (this.im === 0) return `${this.re}`;
    if (this.re === 0) return `${this.im === 1 ? '' : this.im === -1 ? '-' : this.im}i`;
    const sign = this.im > 0 ? '+' : '-';
    const absIm = Math.abs(this.im);
    return `${this.re} ${sign} ${absIm === 1 ? '' : absIm}i`;
  }

  toPolarString(inDegrees: boolean = true): string {
    const r = this.modulus();
    const theta = this.argument(inDegrees);
    return `${r} ∠ ${theta}${inDegrees ? '°' : ' rad'}`;
  }

  toEulerString(): string {
    const r = this.modulus();
    const theta = cleanFloat(this.argument(false), 4);
    if (r === 1) return `e^(${theta}i)`;
    return `${r} · e^(${theta}i)`;
  }
}
