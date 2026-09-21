/**
 * Safe, Robust Recursive Descent Expression Parser & AST Evaluator
 * High-performance, zero eval(), full operator precedence & implicit multiplication
 */

import { toRadians, fromRadians, factorial, permutations, combinations } from './scientific';
import { AngleMode } from '../types';
import { cleanFloat } from './precision';

export type TokenType =
  | 'NUMBER'
  | 'IDENTIFIER'
  | 'OPERATOR'
  | 'LPAREN'
  | 'RPAREN'
  | 'COMMA'
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string;
  pos: number;
}

export interface ASTNode {
  type: 'Number' | 'Identifier' | 'Binary' | 'Unary' | 'Call';
  value?: number | string;
  name?: string;
  op?: string;
  left?: ASTNode;
  right?: ASTNode;
  argument?: ASTNode;
  args?: ASTNode[];
}

export class ExpressionParser {
  private tokens: Token[] = [];
  private current: number = 0;
  private angleMode: AngleMode = 'DEG';
  private variables: Record<string, number> = {};

  constructor(angleMode: AngleMode = 'DEG', variables: Record<string, number> = {}) {
    this.angleMode = angleMode;
    this.variables = {
      pi: Math.PI,
      π: Math.PI,
      e: Math.E,
      phi: 1.618033988749895,
      tau: 2 * Math.PI,
      ...variables,
    };
  }

  setAngleMode(mode: AngleMode) {
    this.angleMode = mode;
  }

  setVariables(vars: Record<string, number>) {
    this.variables = { ...this.variables, ...vars };
  }

  tokenize(input: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;
    const len = input.length;

    // Normalizing visual glyphs
    const norm = input
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'pi');

    while (i < len) {
      const ch = norm[i];

      if (/\s/.test(ch)) {
        i++;
        continue;
      }

      // Numbers (integers, floats, scientific notation 1e-4)
      if (/[0-9]/.test(ch) || (ch === '.' && i + 1 < len && /[0-9]/.test(norm[i + 1]))) {
        let numStr = '';
        const start = i;
        while (i < len && (/[0-9.]/.test(norm[i]) || (/[eE]/.test(norm[i]) && (norm[i + 1] === '+' || norm[i + 1] === '-' || /[0-9]/.test(norm[i + 1]))))) {
          if (/[eE]/.test(norm[i])) {
            numStr += norm[i];
            i++;
            if (i < len && (norm[i] === '+' || norm[i] === '-')) {
              numStr += norm[i];
              i++;
            }
          } else {
            numStr += norm[i];
            i++;
          }
        }

        // Implicit multiplication check before identifier or lparen
        tokens.push({ type: 'NUMBER', value: numStr, pos: start });
        continue;
      }

      // Identifiers / functions / variables / constants
      if (/[a-zA-Z_]/.test(ch)) {
        let idStr = '';
        const start = i;
        while (i < len && /[a-zA-Z0-9_]/.test(norm[i])) {
          idStr += norm[i];
          i++;
        }
        tokens.push({ type: 'IDENTIFIER', value: idStr, pos: start });
        continue;
      }

      // Operators and grouping
      if (ch === '(') {
        tokens.push({ type: 'LPAREN', value: '(', pos: i++ });
        continue;
      }
      if (ch === ')') {
        tokens.push({ type: 'RPAREN', value: ')', pos: i++ });
        continue;
      }
      if (ch === ',') {
        tokens.push({ type: 'COMMA', value: ',', pos: i++ });
        continue;
      }
      if (['+', '-', '*', '/', '^', '%', '!'].includes(ch)) {
        tokens.push({ type: 'OPERATOR', value: ch, pos: i++ });
        continue;
      }

      // Unknown character, skip safely
      i++;
    }

    tokens.push({ type: 'EOF', value: '', pos: len });
    return this.insertImplicitMultiplication(tokens);
  }

  /**
   * Inserts implicit multiplication tokens where standard mathematical notation implies it:
   * e.g., 2pi -> 2 * pi, 2(3) -> 2 * (3), (2)(3) -> (2) * (3), 3x -> 3 * x
   */
  private insertImplicitMultiplication(tokens: Token[]): Token[] {
    const result: Token[] = [];
    for (let i = 0; i < tokens.length; i++) {
      const curr = tokens[i];
      result.push(curr);
      if (i + 1 < tokens.length) {
        const next = tokens[i + 1];
        const isCurrOperand = curr.type === 'NUMBER' || curr.type === 'RPAREN' || curr.type === 'IDENTIFIER';
        const isNextOperand = next.type === 'NUMBER' || next.type === 'LPAREN' || next.type === 'IDENTIFIER';

        // Do not insert if current is a function call like sin(
        const isFunctionCall = curr.type === 'IDENTIFIER' && next.type === 'LPAREN' && this.isKnownFunction(curr.value);

        if (isCurrOperand && isNextOperand && !isFunctionCall) {
          result.push({ type: 'OPERATOR', value: '*', pos: curr.pos });
        }
      }
    }
    return result;
  }

  private isKnownFunction(name: string): boolean {
    const funcs = [
      'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
      'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh',
      'asinh', 'acosh', 'atanh', 'log', 'ln', 'log2',
      'sqrt', 'cbrt', 'exp', 'abs', 'floor', 'ceil', 'round',
      'nCr', 'nPr', 'fact'
    ];
    return funcs.includes(name.toLowerCase());
  }

  parse(input: string): ASTNode {
    this.tokens = this.tokenize(input);
    this.current = 0;
    const node = this.parseExpression();
    return node;
  }

  private peek(): Token {
    return this.tokens[this.current] || { type: 'EOF', value: '', pos: -1 };
  }

  private match(...typesOrValues: string[]): boolean {
    const token = this.peek();
    for (const item of typesOrValues) {
      if (token.type === item || token.value === item) {
        this.current++;
        return true;
      }
    }
    return false;
  }

  private parseExpression(): ASTNode {
    return this.parseAddition();
  }

  // Precedence level 1: Addition & Subtraction
  private parseAddition(): ASTNode {
    let left = this.parseMultiplication();

    while (this.match('+', '-')) {
      const op = this.tokens[this.current - 1].value;
      const right = this.parseMultiplication();
      left = { type: 'Binary', op, left, right };
    }

    return left;
  }

  // Precedence level 2: Multiplication, Division, Modulo
  private parseMultiplication(): ASTNode {
    let left = this.parseExponentiation();

    while (this.match('*', '/', '%')) {
      const op = this.tokens[this.current - 1].value;
      const right = this.parseExponentiation();
      left = { type: 'Binary', op, left, right };
    }

    return left;
  }

  // Precedence level 3: Exponentiation (right associative)
  private parseExponentiation(): ASTNode {
    let left = this.parseUnary();

    if (this.match('^')) {
      const op = '^';
      const right = this.parseExponentiation();
      left = { type: 'Binary', op, left, right };
    }

    return left;
  }

  // Precedence level 4: Unary operators + / -
  private parseUnary(): ASTNode {
    if (this.match('-', '+')) {
      const op = this.tokens[this.current - 1].value;
      const argument = this.parseUnary();
      return { type: 'Unary', op, argument };
    }

    return this.parsePostfix();
  }

  // Precedence level 5: Postfix operators (e.g. 5!)
  private parsePostfix(): ASTNode {
    let left = this.parsePrimary();

    while (this.match('!')) {
      left = { type: 'Unary', op: '!', argument: left };
    }

    return left;
  }

  // Precedence level 6: Primaries (numbers, identifiers, parenthesized expressions, function calls)
  private parsePrimary(): ASTNode {
    const token = this.peek();

    if (token.type === 'NUMBER') {
      this.current++;
      return { type: 'Number', value: parseFloat(token.value) };
    }

    if (token.type === 'IDENTIFIER') {
      this.current++;
      const name = token.value;

      // Check if function call
      if (this.peek().type === 'LPAREN') {
        this.current++; // consume '('
        const args: ASTNode[] = [];
        if (this.peek().type !== 'RPAREN') {
          args.push(this.parseExpression());
          while (this.match(',')) {
            args.push(this.parseExpression());
          }
        }
        if (this.peek().type === 'RPAREN') {
          this.current++; // consume ')'
        }
        return { type: 'Call', name, args };
      }

      return { type: 'Identifier', name };
    }

    if (token.type === 'LPAREN') {
      this.current++;
      const expr = this.parseExpression();
      if (this.peek().type === 'RPAREN') {
        this.current++;
      }
      return expr;
    }

    // Fallback zero if empty
    return { type: 'Number', value: 0 };
  }

  evaluateAST(node: ASTNode): number {
    switch (node.type) {
      case 'Number':
        return Number(node.value);

      case 'Identifier': {
        const id = node.name?.toLowerCase() || '';
        if (id in this.variables) {
          return this.variables[id];
        }
        throw new Error(`Undefined variable: ${node.name}`);
      }

      case 'Unary': {
        const val = this.evaluateAST(node.argument!);
        if (node.op === '-') return -val;
        if (node.op === '+') return val;
        if (node.op === '!') return factorial(Math.round(val));
        return val;
      }

      case 'Binary': {
        const left = this.evaluateAST(node.left!);
        const right = this.evaluateAST(node.right!);

        switch (node.op) {
          case '+': return cleanFloat(left + right);
          case '-': return cleanFloat(left - right);
          case '*': return cleanFloat(left * right);
          case '/':
            if (right === 0) throw new Error('Division by zero');
            return cleanFloat(left / right);
          case '%':
            if (right === 0) throw new Error('Modulo by zero');
            return left % right;
          case '^': return Math.pow(left, right);
          default: return 0;
        }
      }

      case 'Call': {
        const fn = (node.name || '').toLowerCase();
        const evaluatedArgs = (node.args || []).map((a) => this.evaluateAST(a));
        const arg0 = evaluatedArgs[0] ?? 0;
        const arg1 = evaluatedArgs[1] ?? 0;

        switch (fn) {
          case 'sin': return Math.sin(toRadians(arg0, this.angleMode));
          case 'cos': return Math.cos(toRadians(arg0, this.angleMode));
          case 'tan': {
            const rad = toRadians(arg0, this.angleMode);
            // Check undefined multiples of pi/2
            if (Math.abs(Math.cos(rad)) < 1e-15) throw new Error('tan is undefined at odd multiples of π/2');
            return Math.tan(rad);
          }
          case 'cot': return 1 / Math.tan(toRadians(arg0, this.angleMode));
          case 'sec': return 1 / Math.cos(toRadians(arg0, this.angleMode));
          case 'csc': return 1 / Math.sin(toRadians(arg0, this.angleMode));

          case 'asin': return fromRadians(Math.asin(arg0), this.angleMode);
          case 'acos': return fromRadians(Math.acos(arg0), this.angleMode);
          case 'atan': return fromRadians(Math.atan(arg0), this.angleMode);

          case 'sinh': return Math.sinh(arg0);
          case 'cosh': return Math.cosh(arg0);
          case 'tanh': return Math.tanh(arg0);
          case 'asinh': return Math.asinh(arg0);
          case 'acosh': return Math.acosh(arg0);
          case 'atanh': return Math.atanh(arg0);

          case 'sqrt':
            if (arg0 < 0) throw new Error('sqrt of negative number (use Complex mode)');
            return Math.sqrt(arg0);
          case 'cbrt': return Math.cbrt(arg0);
          case 'exp': return Math.exp(arg0);
          case 'ln':
            if (arg0 <= 0) throw new Error('ln undefined for non-positive values');
            return Math.log(arg0);
          case 'log':
            if (arg0 <= 0) throw new Error('log10 undefined for non-positive values');
            return Math.log10(arg0);
          case 'log2':
            if (arg0 <= 0) throw new Error('log2 undefined for non-positive values');
            return Math.log2(arg0);

          case 'abs': return Math.abs(arg0);
          case 'floor': return Math.floor(arg0);
          case 'ceil': return Math.ceil(arg0);
          case 'round': return Math.round(arg0);

          case 'fact': return factorial(Math.round(arg0));
          case 'ncr': return combinations(Math.round(arg0), Math.round(arg1));
          case 'npr': return permutations(Math.round(arg0), Math.round(arg1));

          default:
            throw new Error(`Unknown mathematical function: ${fn}`);
        }
      }

      default:
        return 0;
    }
  }

  evaluate(input: string): number {
    if (!input || input.trim() === '') return 0;
    const ast = this.parse(input);
    return this.evaluateAST(ast);
  }
}

// Global cached parser instance for instant zero-lag standard calculations
export const standardParser = new ExpressionParser('DEG');
