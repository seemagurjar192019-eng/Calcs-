/**
 * Scientific Mathematical Functions Engine
 * Supports DEG / RAD / GRAD angle modes, factorials, permutations, combinations, hyperbolics
 */

import { AngleMode } from '../types';

export function toRadians(angle: number, mode: AngleMode): number {
  if (mode === 'RAD') return angle;
  if (mode === 'DEG') return (angle * Math.PI) / 180;
  if (mode === 'GRAD') return (angle * Math.PI) / 200;
  return angle;
}

export function fromRadians(rad: number, mode: AngleMode): number {
  if (mode === 'RAD') return rad;
  if (mode === 'DEG') return (rad * 180) / Math.PI;
  if (mode === 'GRAD') return (rad * 200) / Math.PI;
  return rad;
}

export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new Error('Factorial requires non-negative integer');
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity; // JS Number max float range limit
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

export function permutations(n: number, r: number): number {
  if (n < 0 || r < 0 || r > n) throw new Error('Invalid values for nPr');
  return factorial(n) / factorial(n - r);
}

export function combinations(n: number, r: number): number {
  if (n < 0 || r < 0 || r > n) throw new Error('Invalid values for nCr');
  return factorial(n) / (factorial(r) * factorial(n - r));
}

export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

export function isPrime(n: number): boolean {
  if (n <= 1 || !Number.isInteger(n)) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

export function primeFactors(n: number): number[] {
  n = Math.abs(Math.round(n));
  const factors: number[] = [];
  while (n % 2 === 0) {
    factors.push(2);
    n /= 2;
  }
  for (let i = 3; i * i <= n; i += 2) {
    while (n % i === 0) {
      factors.push(i);
      n /= i;
    }
  }
  if (n > 2) factors.push(n);
  return factors;
}
