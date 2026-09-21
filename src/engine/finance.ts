/**
 * Finance Calculator Engine
 * EMI, Amortization Schedule, Compound Interest, SIP, CAGR, Tip & Discount
 */

import { cleanFloat } from './precision';

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export class FinanceEngine {
  /**
   * Monthly EMI for loan
   * P = principal, annualRatePct = annual interest %, tenureMonths = months
   */
  static calculateEMI(P: number, annualRatePct: number, tenureMonths: number): {
    emi: number;
    totalInterest: number;
    totalPayment: number;
    schedule: AmortizationRow[];
  } {
    if (P <= 0 || tenureMonths <= 0) {
      return { emi: 0, totalInterest: 0, totalPayment: 0, schedule: [] };
    }

    const r = annualRatePct / 12 / 100;
    let emi = 0;

    if (r === 0) {
      emi = P / tenureMonths;
    } else {
      emi = (P * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1);
    }

    const roundedEMI = cleanFloat(emi, 6);
    const schedule: AmortizationRow[] = [];
    let balance = P;
    let totalInterest = 0;

    for (let m = 1; m <= tenureMonths; m++) {
      const interest = balance * r;
      const principal = emi - interest;
      balance = Math.max(0, balance - principal);
      totalInterest += interest;

      schedule.push({
        month: m,
        payment: cleanFloat(emi, 2),
        principal: cleanFloat(principal, 2),
        interest: cleanFloat(interest, 2),
        balance: cleanFloat(balance, 2),
      });
    }

    const totalPayment = P + totalInterest;

    return {
      emi: cleanFloat(roundedEMI, 2),
      totalInterest: cleanFloat(totalInterest, 2),
      totalPayment: cleanFloat(totalPayment, 2),
      schedule,
    };
  }

  /**
   * Compound Interest
   * A = P * (1 + r/n)^(n*t)
   */
  static compoundInterest(
    principal: number,
    annualRatePct: number,
    years: number,
    compoundingTimesPerYear: number = 12
  ): { finalAmount: number; interestEarned: number } {
    const r = annualRatePct / 100;
    const n = compoundingTimesPerYear;
    const t = years;
    const finalAmount = principal * Math.pow(1 + r / n, n * t);
    const interestEarned = finalAmount - principal;

    return {
      finalAmount: cleanFloat(finalAmount, 2),
      interestEarned: cleanFloat(interestEarned, 2),
    };
  }

  /**
   * Systematic Investment Plan (SIP)
   * M = P * ((1 + i)^n - 1) / i * (1 + i)
   */
  static calculateSIP(
    monthlyInvestment: number,
    annualReturnPct: number,
    years: number
  ): { invested: number; returns: number; maturity: number } {
    const i = annualReturnPct / 12 / 100;
    const n = years * 12;
    const maturity = monthlyInvestment * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const invested = monthlyInvestment * n;
    const returns = maturity - invested;

    return {
      invested: cleanFloat(invested, 2),
      returns: cleanFloat(returns, 2),
      maturity: cleanFloat(maturity, 2),
    };
  }

  /**
   * CAGR (Compound Annual Growth Rate)
   */
  static calculateCAGR(startValue: number, endValue: number, years: number): number {
    if (startValue <= 0 || years <= 0) return 0;
    const cagr = (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
    return cleanFloat(cagr, 2);
  }

  /**
   * Tip and Split
   */
  static calculateTip(bill: number, tipPct: number, splitCount: number = 1): {
    tipAmount: number;
    totalAmount: number;
    perPerson: number;
  } {
    const tipAmount = cleanFloat((bill * tipPct) / 100, 2);
    const totalAmount = cleanFloat(bill + tipAmount, 2);
    const perPerson = cleanFloat(totalAmount / Math.max(1, splitCount), 2);
    return { tipAmount, totalAmount, perPerson };
  }
}
