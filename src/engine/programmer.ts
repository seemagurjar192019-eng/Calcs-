/**
 * Programmer Calculator Engine
 * Handles 8, 16, 32, 64-bit integer bitwise operations, masking, signed/unsigned conversions, and bases (HEX, DEC, OCT, BIN)
 */

import { NumberBase, WordSize } from '../types';

export class ProgrammerEngine {
  static getMask(wordSize: WordSize): bigint {
    switch (wordSize) {
      case 8: return 0xffn;
      case 16: return 0xffffn;
      case 32: return 0xffffffffn;
      case 64: return 0xffffffffffffffffn;
    }
  }

  static clamp(val: bigint, wordSize: WordSize): bigint {
    const mask = this.getMask(wordSize);
    return val & mask;
  }

  static toSigned(val: bigint, wordSize: WordSize): bigint {
    const unsigned = this.clamp(val, wordSize);
    const signBit = 1n << BigInt(wordSize - 1);
    if ((unsigned & signBit) !== 0n) {
      return unsigned - (1n << BigInt(wordSize));
    }
    return unsigned;
  }

  static parseBase(str: string, base: NumberBase, wordSize?: WordSize): bigint {
    const cleaned = str.replace(/[\s_,]/g, '');
    if (!cleaned) return 0n;
    let res = 0n;
    switch (base) {
      case 'HEX': res = BigInt(`0x${cleaned}`); break;
      case 'DEC': res = BigInt(cleaned); break;
      case 'OCT': res = BigInt(`0o${cleaned}`); break;
      case 'BIN': res = BigInt(`0b${cleaned}`); break;
    }
    return wordSize ? this.clamp(res, wordSize) : res;
  }

  static toggleBit(val: bigint, bitIndex: number, wordSize: WordSize): bigint {
    const bitMask = 1n << BigInt(bitIndex);
    return this.clamp(val ^ bitMask, wordSize);
  }

  static lsh(a: bigint, n: number, wordSize: WordSize): bigint {
    return this.shiftLeft(a, n, wordSize);
  }

  static rsh(a: bigint, n: number, wordSize: WordSize): bigint {
    return this.shiftRightLogical(a, n, wordSize);
  }

  static ashr(a: bigint, n: number, wordSize: WordSize): bigint {
    return this.shiftRightArithmetic(a, n, wordSize);
  }

  static formatBase(val: bigint, base: NumberBase, wordSize: WordSize): string {
    const clamped = this.clamp(val, wordSize);
    switch (base) {
      case 'HEX': return clamped.toString(16).toUpperCase();
      case 'DEC': return this.toSigned(clamped, wordSize).toString(10);
      case 'OCT': return clamped.toString(8);
      case 'BIN': {
        const binStr = clamped.toString(2);
        return binStr.padStart(wordSize, '0');
      }
    }
  }

  static bitwiseAnd(a: bigint, b: bigint, wordSize: WordSize): bigint {
    return this.clamp(a & b, wordSize);
  }

  static bitwiseOr(a: bigint, b: bigint, wordSize: WordSize): bigint {
    return this.clamp(a | b, wordSize);
  }

  static bitwiseXor(a: bigint, b: bigint, wordSize: WordSize): bigint {
    return this.clamp(a ^ b, wordSize);
  }

  static bitwiseNot(a: bigint, wordSize: WordSize): bigint {
    return this.clamp(~a, wordSize);
  }

  static shiftLeft(a: bigint, n: number, wordSize: WordSize): bigint {
    return this.clamp(a << BigInt(n), wordSize);
  }

  static shiftRightLogical(a: bigint, n: number, wordSize: WordSize): bigint {
    const clamped = this.clamp(a, wordSize);
    return this.clamp(clamped >> BigInt(n), wordSize);
  }

  static shiftRightArithmetic(a: bigint, n: number, wordSize: WordSize): bigint {
    const signed = this.toSigned(a, wordSize);
    return this.clamp(signed >> BigInt(n), wordSize);
  }
}
