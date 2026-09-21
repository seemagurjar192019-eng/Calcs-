/**
 * Dimensional Analysis Engine
 * Dimension formula validation (Length L, Mass M, Time T, Current I, Temp Θ)
 * Rejects dimensionally invalid expressions (e.g., adding meters + seconds)
 */

export interface Dimensions {
  L: number; // Length
  M: number; // Mass
  T: number; // Time
  I: number; // Electric Current
}

export class DimensionValue {
  value: number;
  dim: Dimensions;
  unitName: string;

  constructor(value: number, dim: Dimensions, unitName: string) {
    this.value = value;
    this.dim = dim;
    this.unitName = unitName;
  }

  static areDimensionsEqual(d1: Dimensions, d2: Dimensions): boolean {
    return d1.L === d2.L && d1.M === d2.M && d1.T === d2.T && d1.I === d2.I;
  }

  add(other: DimensionValue): DimensionValue {
    if (!DimensionValue.areDimensionsEqual(this.dim, other.dim)) {
      throw new Error(
        `Dimensional Inconsistency: Cannot add ${this.unitName} (${this.getFormula()}) and ${other.unitName} (${other.getFormula()})`
      );
    }
    return new DimensionValue(this.value + other.value, this.dim, this.unitName);
  }

  subtract(other: DimensionValue): DimensionValue {
    if (!DimensionValue.areDimensionsEqual(this.dim, other.dim)) {
      throw new Error(
        `Dimensional Inconsistency: Cannot subtract ${other.unitName} from ${this.unitName}`
      );
    }
    return new DimensionValue(this.value - other.value, this.dim, this.unitName);
  }

  multiply(other: DimensionValue): DimensionValue {
    const newDim: Dimensions = {
      L: this.dim.L + other.dim.L,
      M: this.dim.M + other.dim.M,
      T: this.dim.T + other.dim.T,
      I: this.dim.I + other.dim.I,
    };
    return new DimensionValue(this.value * other.value, newDim, `${this.unitName}·${other.unitName}`);
  }

  divide(other: DimensionValue): DimensionValue {
    if (other.value === 0) throw new Error('Division by zero in dimensional calculation');
    const newDim: Dimensions = {
      L: this.dim.L - other.dim.L,
      M: this.dim.M - other.dim.M,
      T: this.dim.T - other.dim.T,
      I: this.dim.I - other.dim.I,
    };
    return new DimensionValue(this.value / other.value, newDim, `${this.unitName}/${other.unitName}`);
  }

  getFormula(): string {
    const parts: string[] = [];
    if (this.dim.L !== 0) parts.push(`L${this.dim.L !== 1 ? `^${this.dim.L}` : ''}`);
    if (this.dim.M !== 0) parts.push(`M${this.dim.M !== 1 ? `^${this.dim.M}` : ''}`);
    if (this.dim.T !== 0) parts.push(`T${this.dim.T !== 1 ? `^${this.dim.T}` : ''}`);
    if (this.dim.I !== 0) parts.push(`I${this.dim.I !== 1 ? `^${this.dim.I}` : ''}`);
    return parts.length > 0 ? `[${parts.join(' ')}]` : '[Dimensionless]';
  }
}
