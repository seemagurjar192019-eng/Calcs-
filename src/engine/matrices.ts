/**
 * Matrix Laboratory & Linear Algebra Workbench Engine
 * Addition, subtraction, multiplication, determinant, inverse, rank, trace, Gaussian elimination, eigenvalues estimation
 */

import { cleanFloat } from './precision';

export type Matrix = number[][];

export class MatrixEngine {
  static create(rows: number, cols: number, initial: number = 0): Matrix {
    return Array.from({ length: rows }, () => Array(cols).fill(initial));
  }

  static identity(n: number): Matrix {
    const mat = this.create(n, n, 0);
    for (let i = 0; i < n; i++) mat[i][i] = 1;
    return mat;
  }

  static clone(mat: Matrix): Matrix {
    return mat.map((row) => [...row]);
  }

  static add(A: Matrix, B: Matrix): Matrix {
    if (A.length !== B.length || A[0].length !== B[0].length) {
      throw new Error('Matrix dimensions must match for addition');
    }
    return A.map((row, i) => row.map((val, j) => cleanFloat(val + B[i][j])));
  }

  static subtract(A: Matrix, B: Matrix): Matrix {
    if (A.length !== B.length || A[0].length !== B[0].length) {
      throw new Error('Matrix dimensions must match for subtraction');
    }
    return A.map((row, i) => row.map((val, j) => cleanFloat(val - B[i][j])));
  }

  static scale(A: Matrix, scalar: number): Matrix {
    return A.map((row) => row.map((val) => cleanFloat(val * scalar)));
  }

  static multiply(A: Matrix, B: Matrix): Matrix {
    const rA = A.length;
    const cA = A[0].length;
    const rB = B.length;
    const cB = B[0].length;

    if (cA !== rB) {
      throw new Error(`Matrix multiplication error: ${rA}x${cA} cannot multiply ${rB}x${cB}`);
    }

    const result = this.create(rA, cB, 0);
    for (let i = 0; i < rA; i++) {
      for (let j = 0; j < cB; j++) {
        let sum = 0;
        for (let k = 0; k < cA; k++) {
          sum += A[i][k] * B[k][j];
        }
        result[i][j] = cleanFloat(sum);
      }
    }
    return result;
  }

  static transpose(A: Matrix): Matrix {
    const r = A.length;
    const c = A[0].length;
    const res = this.create(c, r, 0);
    for (let i = 0; i < r; i++) {
      for (let j = 0; j < c; j++) {
        res[j][i] = A[i][j];
      }
    }
    return res;
  }

  static trace(A: Matrix): number {
    if (A.length !== A[0].length) throw new Error('Trace requires square matrix');
    let tr = 0;
    for (let i = 0; i < A.length; i++) tr += A[i][i];
    return cleanFloat(tr);
  }

  static determinant(A: Matrix): number {
    const n = A.length;
    if (n !== A[0].length) throw new Error('Determinant requires square matrix');
    if (n === 1) return A[0][0];
    if (n === 2) return cleanFloat(A[0][0] * A[1][1] - A[0][1] * A[1][0]);

    // Gaussian elimination with partial pivoting to calculate determinant
    const mat = this.clone(A);
    let det = 1;

    for (let i = 0; i < n; i++) {
      let pivot = i;
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(mat[j][i]) > Math.abs(mat[pivot][i])) pivot = j;
      }

      if (Math.abs(mat[pivot][i]) < 1e-12) return 0;

      if (pivot !== i) {
        const temp = mat[i];
        mat[i] = mat[pivot];
        mat[pivot] = temp;
        det = -det;
      }

      det *= mat[i][i];
      for (let j = i + 1; j < n; j++) {
        const factor = mat[j][i] / mat[i][i];
        for (let k = i; k < n; k++) {
          mat[j][k] -= factor * mat[i][k];
        }
      }
    }

    return cleanFloat(det);
  }

  static inverse(A: Matrix): Matrix {
    const n = A.length;
    if (n !== A[0].length) throw new Error('Inverse requires square matrix');
    const det = this.determinant(A);
    if (Math.abs(det) < 1e-11) throw new Error('Matrix is singular (determinant is 0), no inverse exists');

    // Augmented matrix [A | I]
    const aug = this.create(n, 2 * n, 0);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) aug[i][j] = A[i][j];
      aug[i][n + i] = 1;
    }

    // Gauss-Jordan elimination
    for (let i = 0; i < n; i++) {
      let pivot = i;
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(aug[j][i]) > Math.abs(aug[pivot][i])) pivot = j;
      }

      if (pivot !== i) {
        const temp = aug[i];
        aug[i] = aug[pivot];
        aug[pivot] = temp;
      }

      const pVal = aug[i][i];
      for (let j = 0; j < 2 * n; j++) aug[i][j] /= pVal;

      for (let j = 0; j < n; j++) {
        if (j !== i) {
          const factor = aug[j][i];
          for (let k = 0; k < 2 * n; k++) {
            aug[j][k] -= factor * aug[i][k];
          }
        }
      }
    }

    const inv = this.create(n, n, 0);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        inv[i][j] = cleanFloat(aug[i][n + j]);
      }
    }
    return inv;
  }

  static gaussianEliminationSteps(A: Matrix): { steps: string[]; rref: Matrix } {
    const r = A.length;
    const c = A[0].length;
    const mat = this.clone(A);
    const steps: string[] = ['Initial augmented matrix'];

    let lead = 0;
    for (let i = 0; i < r; i++) {
      if (lead >= c) break;
      let pivot = i;
      while (Math.abs(mat[pivot][lead]) < 1e-12) {
        pivot++;
        if (pivot === r) {
          pivot = i;
          lead++;
          if (lead === c) break;
        }
      }
      if (lead >= c) break;

      if (pivot !== i) {
        const t = mat[i];
        mat[i] = mat[pivot];
        mat[pivot] = t;
        steps.push(`Swap Row ${i + 1} with Row ${pivot + 1}`);
      }

      const lv = mat[i][lead];
      if (Math.abs(lv - 1) > 1e-9) {
        for (let j = 0; j < c; j++) mat[i][j] /= lv;
        steps.push(`Divide Row ${i + 1} by ${cleanFloat(lv)} to make leading 1`);
      }

      for (let j = 0; j < r; j++) {
        if (j !== i) {
          const factor = mat[j][lead];
          if (Math.abs(factor) > 1e-12) {
            for (let k = 0; k < c; k++) {
              mat[j][k] -= factor * mat[i][k];
            }
            steps.push(`R${j + 1} = R${j + 1} - (${cleanFloat(factor)}) * R${i + 1}`);
          }
        }
      }
      lead++;
    }

    // Clean floats
    for (let i = 0; i < r; i++) {
      for (let j = 0; j < c; j++) {
        mat[i][j] = cleanFloat(mat[i][j]);
      }
    }

    return { steps, rref: mat };
  }

  static rank(A: Matrix): number {
    const { rref } = this.gaussianEliminationSteps(A);
    let count = 0;
    for (const row of rref) {
      if (row.some((v) => Math.abs(v) > 1e-9)) count++;
    }
    return count;
  }
}
