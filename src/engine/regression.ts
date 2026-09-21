/**
 * Regression Lab Engine
 * Linear Regression y = mx + b, Pearson Correlation (r), Coefficient of Determination (R²), Covariance
 */

import { cleanFloat } from './precision';

export interface DataPoint {
  x: number;
  y: number;
}

export interface RegressionResult {
  slope: number;
  intercept: number;
  r: number;
  r2: number;
  covariance: number;
  equation: string;
  residuals: number[];
  predict: (x: number) => number;
}

export class RegressionEngine {
  static linearRegression(points: DataPoint[]): RegressionResult {
    const n = points.length;
    if (n < 2) throw new Error('At least 2 data points required for linear regression');

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    let sumY2 = 0;

    for (const p of points) {
      sumX += p.x;
      sumY += p.y;
      sumXY += p.x * p.y;
      sumX2 += p.x * p.x;
      sumY2 += p.y * p.y;
    }

    const meanX = sumX / n;
    const meanY = sumY / n;

    const denom = n * sumX2 - sumX * sumX;
    if (Math.abs(denom) < 1e-12) {
      throw new Error('Cannot calculate regression: all X coordinates are identical (vertical line)');
    }

    const slope = cleanFloat((n * sumXY - sumX * sumY) / denom);
    const intercept = cleanFloat(meanY - slope * meanX);

    // Pearson correlation r
    const rDenom = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    const r = rDenom === 0 ? 0 : cleanFloat((n * sumXY - sumX * sumY) / rDenom);
    const r2 = cleanFloat(r * r);

    // Covariance
    const cov = cleanFloat((sumXY - (sumX * sumY) / n) / (n - 1));

    // Residuals
    const residuals = points.map((p) => cleanFloat(p.y - (slope * p.x + intercept)));

    const eq = `y = ${slope}x ${intercept >= 0 ? '+' : '-'} ${Math.abs(intercept)}`;
    const predict = (x: number) => cleanFloat(slope * x + intercept);

    return { slope, intercept, r, r2, covariance: cov, equation: eq, residuals, predict };
  }
}
