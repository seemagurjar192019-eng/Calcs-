/**
 * Date and Time Calculator Engine
 * Difference, business days, add/subtract intervals, age calculation, leap years, weekday finder
 */

export class DateCalculatorEngine {
  static daysBetween(d1: Date, d2: Date): { days: number; weeks: number; businessDays: number } {
    const timeDiff = Math.abs(d2.getTime() - d1.getTime());
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);

    // Calculate business days (Monday-Friday)
    let businessDays = 0;
    const start = new Date(Math.min(d1.getTime(), d2.getTime()));
    const end = new Date(Math.max(d1.getTime(), d2.getTime()));

    const cur = new Date(start);
    while (cur < end) {
      cur.setDate(cur.getDate() + 1);
      const dayOfWeek = cur.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        businessDays++;
      }
    }

    return { days, weeks, businessDays };
  }

  static addTime(date: Date, days: number = 0, months: number = 0, years: number = 0): Date {
    const res = new Date(date);
    if (years !== 0) res.setFullYear(res.getFullYear() + years);
    if (months !== 0) res.setMonth(res.getMonth() + months);
    if (days !== 0) res.setDate(res.getDate() + days);
    return res;
  }

  static calculateAge(birthDate: Date, targetDate: Date = new Date()): {
    years: number;
    months: number;
    days: number;
    totalDays: number;
  } {
    let years = targetDate.getFullYear() - birthDate.getFullYear();
    let months = targetDate.getMonth() - birthDate.getMonth();
    let days = targetDate.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((targetDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));

    return { years, months, days, totalDays };
  }

  static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  static getWeekday(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }
}
