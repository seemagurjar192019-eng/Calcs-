/**
 * Comprehensive Unit Conversion Engine
 * Accurate ratios for scientific, engineering, and everyday measurements
 */

import { cleanFloat } from './precision';

export type UnitCategory =
  | 'length'
  | 'mass'
  | 'temperature'
  | 'area'
  | 'volume'
  | 'speed'
  | 'time'
  | 'digital';

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  toBase: (val: number) => number;
  fromBase: (baseVal: number) => number;
}

export const UNIT_CATEGORIES: Record<UnitCategory, { name: string; units: UnitDefinition[] }> = {
  length: {
    name: 'Length & Distance',
    units: [
      { id: 'm', name: 'Meters', symbol: 'm', toBase: (v) => v, fromBase: (b) => b },
      { id: 'km', name: 'Kilometers', symbol: 'km', toBase: (v) => v * 1000, fromBase: (b) => b / 1000 },
      { id: 'cm', name: 'Centimeters', symbol: 'cm', toBase: (v) => v * 0.01, fromBase: (b) => b / 0.01 },
      { id: 'mm', name: 'Millimeters', symbol: 'mm', toBase: (v) => v * 0.001, fromBase: (b) => b / 0.001 },
      { id: 'mi', name: 'Miles', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (b) => b / 1609.344 },
      { id: 'yd', name: 'Yards', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (b) => b / 0.9144 },
      { id: 'ft', name: 'Feet', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (b) => b / 0.3048 },
      { id: 'in', name: 'Inches', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (b) => b / 0.0254 },
      { id: 'nm', name: 'Nautical Miles', symbol: 'NM', toBase: (v) => v * 1852, fromBase: (b) => b / 1852 },
    ],
  },
  mass: {
    name: 'Mass & Weight',
    units: [
      { id: 'kg', name: 'Kilograms', symbol: 'kg', toBase: (v) => v, fromBase: (b) => b },
      { id: 'g', name: 'Grams', symbol: 'g', toBase: (v) => v * 0.001, fromBase: (b) => b / 0.001 },
      { id: 'mg', name: 'Milligrams', symbol: 'mg', toBase: (v) => v * 1e-6, fromBase: (b) => b / 1e-6 },
      { id: 'lb', name: 'Pounds', symbol: 'lb', toBase: (v) => v * 0.45359237, fromBase: (b) => b / 0.45359237 },
      { id: 'oz', name: 'Ounces', symbol: 'oz', toBase: (v) => v * 0.028349523125, fromBase: (b) => b / 0.028349523125 },
      { id: 't', name: 'Metric Tons', symbol: 't', toBase: (v) => v * 1000, fromBase: (b) => b / 1000 },
    ],
  },
  temperature: {
    name: 'Temperature',
    units: [
      { id: 'c', name: 'Celsius', symbol: '°C', toBase: (v) => v + 273.15, fromBase: (b) => b - 273.15 },
      { id: 'f', name: 'Fahrenheit', symbol: '°F', toBase: (v) => ((v - 32) * 5) / 9 + 273.15, fromBase: (b) => ((b - 273.15) * 9) / 5 + 32 },
      { id: 'k', name: 'Kelvin', symbol: 'K', toBase: (v) => v, fromBase: (b) => b },
    ],
  },
  area: {
    name: 'Area',
    units: [
      { id: 'm2', name: 'Square Meters', symbol: 'm²', toBase: (v) => v, fromBase: (b) => b },
      { id: 'km2', name: 'Square Kilometers', symbol: 'km²', toBase: (v) => v * 1e6, fromBase: (b) => b / 1e6 },
      { id: 'ha', name: 'Hectares', symbol: 'ha', toBase: (v) => v * 10000, fromBase: (b) => b / 10000 },
      { id: 'acre', name: 'Acres', symbol: 'ac', toBase: (v) => v * 4046.8564224, fromBase: (b) => b / 4046.8564224 },
      { id: 'ft2', name: 'Square Feet', symbol: 'ft²', toBase: (v) => v * 0.092903, fromBase: (b) => b / 0.092903 },
    ],
  },
  volume: {
    name: 'Volume',
    units: [
      { id: 'l', name: 'Liters', symbol: 'L', toBase: (v) => v, fromBase: (b) => b },
      { id: 'ml', name: 'Milliliters', symbol: 'mL', toBase: (v) => v * 0.001, fromBase: (b) => b / 0.001 },
      { id: 'm3', name: 'Cubic Meters', symbol: 'm³', toBase: (v) => v * 1000, fromBase: (b) => b / 1000 },
      { id: 'gal', name: 'US Gallons', symbol: 'gal', toBase: (v) => v * 3.785411784, fromBase: (b) => b / 3.785411784 },
      { id: 'qt', name: 'US Quarts', symbol: 'qt', toBase: (v) => v * 0.946352946, fromBase: (b) => b / 0.946352946 },
    ],
  },
  speed: {
    name: 'Speed & Velocity',
    units: [
      { id: 'mps', name: 'Meters / second', symbol: 'm/s', toBase: (v) => v, fromBase: (b) => b },
      { id: 'kmh', name: 'Kilometers / hour', symbol: 'km/h', toBase: (v) => v / 3.6, fromBase: (b) => b * 3.6 },
      { id: 'mph', name: 'Miles / hour', symbol: 'mph', toBase: (v) => v * 0.44704, fromBase: (b) => b / 0.44704 },
      { id: 'knot', name: 'Knots', symbol: 'kn', toBase: (v) => v * 0.514444, fromBase: (b) => b / 0.514444 },
      { id: 'c_speed', name: 'Speed of Light', symbol: 'c', toBase: (v) => v * 299792458, fromBase: (b) => b / 299792458 },
    ],
  },
  time: {
    name: 'Time',
    units: [
      { id: 's', name: 'Seconds', symbol: 's', toBase: (v) => v, fromBase: (b) => b },
      { id: 'ms', name: 'Milliseconds', symbol: 'ms', toBase: (v) => v * 0.001, fromBase: (b) => b / 0.001 },
      { id: 'min', name: 'Minutes', symbol: 'min', toBase: (v) => v * 60, fromBase: (b) => b / 60 },
      { id: 'hr', name: 'Hours', symbol: 'hr', toBase: (v) => v * 3600, fromBase: (b) => b / 3600 },
      { id: 'day', name: 'Days', symbol: 'd', toBase: (v) => v * 86400, fromBase: (b) => b / 86400 },
      { id: 'yr', name: 'Years (365d)', symbol: 'yr', toBase: (v) => v * 31536000, fromBase: (b) => b / 31536000 },
    ],
  },
  digital: {
    name: 'Digital Data',
    units: [
      { id: 'b', name: 'Bytes', symbol: 'B', toBase: (v) => v, fromBase: (b) => b },
      { id: 'kb', name: 'Kilobytes (1000B)', symbol: 'KB', toBase: (v) => v * 1000, fromBase: (b) => b / 1000 },
      { id: 'kib', name: 'Kibibytes (1024B)', symbol: 'KiB', toBase: (v) => v * 1024, fromBase: (b) => b / 1024 },
      { id: 'mb', name: 'Megabytes', symbol: 'MB', toBase: (v) => v * 1e6, fromBase: (b) => b / 1e6 },
      { id: 'mib', name: 'Mebibytes', symbol: 'MiB', toBase: (v) => v * 1048576, fromBase: (b) => b / 1048576 },
      { id: 'gb', name: 'Gigabytes', symbol: 'GB', toBase: (v) => v * 1e9, fromBase: (b) => b / 1e9 },
      { id: 'gib', name: 'Gibibytes', symbol: 'GiB', toBase: (v) => v * 1073741824, fromBase: (b) => b / 1073741824 },
      { id: 'tb', name: 'Terabytes', symbol: 'TB', toBase: (v) => v * 1e12, fromBase: (b) => b / 1e12 },
    ],
  },
};

export function convertUnits(
  category: UnitCategory,
  fromUnitId: string,
  toUnitId: string,
  value: number
): number {
  const cat = UNIT_CATEGORIES[category];
  if (!cat) throw new Error(`Unknown unit category: ${category}`);

  const fromUnit = cat.units.find((u) => u.id === fromUnitId);
  const toUnit = cat.units.find((u) => u.id === toUnitId);

  if (!fromUnit || !toUnit) throw new Error('Invalid unit selection');

  const baseVal = fromUnit.toBase(value);
  const converted = toUnit.fromBase(baseVal);
  return cleanFloat(converted, 8);
}
