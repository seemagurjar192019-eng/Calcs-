/**
 * Proper Rational Fraction Representation and Arithmetic Engine
 */

export class Rational {
  numerator: bigint;
  denominator: bigint;

  constructor(numerator: bigint | number, denominator: bigint | number = 1n) {
    let n = BigInt(Math.floor(Number(numerator)));
    let d = BigInt(Math.floor(Number(denominator)));

    if (d === 0n) {
      throw new Error('Division by zero in fraction');
    }

    if (d < 0n) {
      n = -n;
      d = -d;
    }

    const g = Rational.gcd(n < 0n ? -n : n, d);
    this.numerator = n / g;
    this.denominator = d / g;
  }

  static gcd(a: bigint, b: bigint): bigint {
    while (b !== 0n) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  }

  static fromNumber(val: number, maxDenominator: bigint = 1000000n): Rational {
    if (!Number.isFinite(val)) throw new Error('Cannot convert non-finite to fraction');
    if (Number.isInteger(val)) return new Rational(BigInt(val), 1n);

    // Continuous fraction expansion for best rational approximation
    const sign = val < 0 ? -1n : 1n;
    let x = Math.abs(val);

    let p0 = 0n, q0 = 1n;
    let p1 = 1n, q1 = 0n;

    for (let i = 0; i < 30; i++) {
      const a = BigInt(Math.floor(x));
      const p2 = a * p1 + p0;
      const q2 = a * q1 + q0;

      if (q2 > maxDenominator) break;

      p0 = p1; q0 = q1;
      p1 = p2; q1 = q2;

      const frac = x - Math.floor(x);
      if (frac < 1e-12) break;
      x = 1 / frac;
    }

    return new Rational(sign * p1, q1);
  }

  add(other: Rational): Rational {
    return new Rational(
      this.numerator * other.denominator + other.numerator * this.denominator,
      this.denominator * other.denominator
    );
  }

  subtract(other: Rational): Rational {
    return new Rational(
      this.numerator * other.denominator - other.numerator * this.denominator,
      this.denominator * other.denominator
    );
  }

  multiply(other: Rational): Rational {
    return new Rational(
      this.numerator * other.numerator,
      this.denominator * other.denominator
    );
  }

  divide(other: Rational): Rational {
    if (other.numerator === 0n) throw new Error('Division by zero');
    return new Rational(
      this.numerator * other.denominator,
      this.denominator * other.numerator
    );
  }

  pow(exponent: number): Rational {
    if (exponent === 0) return new Rational(1n, 1n);
    if (exponent < 0) {
      return new Rational(this.denominator ** BigInt(-exponent), this.numerator ** BigInt(-exponent));
    }
    return new Rational(this.numerator ** BigInt(exponent), this.denominator ** BigInt(exponent));
  }

  toNumber(): number {
    return Number(this.numerator) / Number(this.denominator);
  }

  toString(): string {
    if (this.denominator === 1n) return this.numerator.toString();
    return `${this.numerator}/${this.denominator}`;
  }

  toMixedString(): string {
    if (this.denominator === 1n) return this.numerator.toString();
    const whole = this.numerator / this.denominator;
    const remainder = this.numerator % this.denominator;
    const absRem = remainder < 0n ? -remainder : remainder;

    if (whole === 0n) {
      return `${remainder}/${this.denominator}`;
    }
    return `${whole} ${absRem}/${this.denominator}`;
  }
}
