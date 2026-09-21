/**
 * Statistics Engine
 * Descriptive statistics (mean, median, mode, variance, std deviation),
 * and probability distributions (Normal, Binomial, Poisson, z-scores)
 */

import { cleanFloat } from './precision';
import { combinations } from './scientific';

export interface DescriptiveStats {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number[];
  min: number;
  max: number;
  range: number;
  variance: number;
  stdDev: number;
  q1: number;
  q3: number;
  iqr: number;
}

export class StatisticsEngine {
  static analyzeDataset(data: number[]): DescriptiveStats {
    if (data.length === 0) throw new Error('Dataset is empty');

    const sorted = [...data].sort((a, b) => a - b);
    const count = sorted.length;
    const sum = sorted.reduce((acc, v) => acc + v, 0);
    const mean = cleanFloat(sum / count);

    // Median
    let median: number;
    if (count % 2 === 0) {
      median = (sorted[count / 2 - 1] + sorted[count / 2]) / 2;
    } else {
      median = sorted[Math.floor(count / 2)];
    }
    median = cleanFloat(median);

    // Mode
    const freq = new Map<number, number>();
    let maxFreq = 0;
    for (const v of sorted) {
      const f = (freq.get(v) || 0) + 1;
      freq.set(v, f);
      if (f > maxFreq) maxFreq = f;
    }
    const mode: number[] = [];
    if (maxFreq > 1) {
      for (const [v, f] of freq.entries()) {
        if (f === maxFreq) mode.push(v);
      }
    }

    const min = sorted[0];
    const max = sorted[count - 1];
    const range = cleanFloat(max - min);

    // Variance & StdDev (sample variance if N > 1)
    const varSum = sorted.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0);
    const variance = count > 1 ? cleanFloat(varSum / (count - 1)) : 0;
    const stdDev = cleanFloat(Math.sqrt(variance));

    // Quartiles
    const q1 = sorted[Math.floor(count * 0.25)];
    const q3 = sorted[Math.floor(count * 0.75)];
    const iqr = cleanFloat(q3 - q1);

    return { count, sum: cleanFloat(sum), mean, median, mode, min, max, range, variance, stdDev, q1, q3, iqr };
  }

  // Normal PDF
  static normalPdf(x: number, mean: number = 0, stdDev: number = 1): number {
    const factor = 1 / (stdDev * Math.sqrt(2 * Math.PI));
    const exponent = -Math.pow(x - mean, 2) / (2 * stdDev * stdDev);
    return cleanFloat(factor * Math.exp(exponent), 6);
  }

  // Standard Normal CDF (error function approximation)
  static normalCdf(x: number, mean: number = 0, stdDev: number = 1): number {
    const z = (x - mean) / (stdDev * Math.sqrt(2));
    // Approximation of erf(z)
    const t = 1 / (1 + 0.3275911 * Math.abs(z));
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const erf = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-z * z);
    const sign = z >= 0 ? 1 : -1;
    const cdf = 0.5 * (1 + sign * erf);
    return cleanFloat(cdf, 6);
  }

  // Binomial PMF: P(X = k) = nCk * p^k * (1-p)^(n-k)
  static binomialPmf(k: number, n: number, p: number): number {
    if (k < 0 || k > n || p < 0 || p > 1) return 0;
    const comb = combinations(n, k);
    return cleanFloat(comb * Math.pow(p, k) * Math.pow(1 - p, n - k), 6);
  }

  // Poisson PMF: P(X = k) = (lambda^k * e^-lambda) / k!
  static poissonPmf(k: number, lambda: number): number {
    if (k < 0 || lambda <= 0) return 0;
    let kFact = 1;
    for (let i = 2; i <= k; i++) kFact *= i;
    return cleanFloat((Math.pow(lambda, k) * Math.exp(-lambda)) / kFact, 6);
  }
}
