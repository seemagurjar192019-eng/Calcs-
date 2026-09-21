/**
 * High-Performance Local Persistence
 * LocalStorage + debounced storage with export/import and workspace sync
 */

import { HistoryItem, Workspace, Macro } from '../types';

const STORAGE_KEYS = {
  HISTORY: 'prec_calc_history',
  WORKSPACES: 'prec_calc_workspaces',
  ACTIVE_WORKSPACE: 'prec_calc_active_ws',
  MACROS: 'prec_calc_macros',
  THEME: 'prec_calc_theme',
};

export class StorageEngine {
  static getHistory(): HistoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveHistory(items: HistoryItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(items.slice(0, 100)));
    } catch (e) {
      console.warn('Failed to save history to storage', e);
    }
  }

  static getWorkspaces(): Workspace[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WORKSPACES);
      if (data) return JSON.parse(data);
    } catch {}

    // Default workspace
    return [
      {
        id: 'ws_default',
        name: 'General Math',
        description: 'Standard technical workspace',
        variables: { x: 10, y: 5 },
        functions: {},
        history: [],
        created: Date.now(),
        updated: Date.now(),
      },
      {
        id: 'ws_physics',
        name: 'Physics Lab',
        description: 'Constants and kinematic equations',
        variables: { c: 299792458, g: 9.80665, h: 6.626e-34 },
        functions: {},
        history: [],
        created: Date.now(),
        updated: Date.now(),
      },
    ];
  }

  static saveWorkspaces(workspaces: Workspace[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.WORKSPACES, JSON.stringify(workspaces));
    } catch (e) {
      console.warn('Failed to save workspaces', e);
    }
  }

  static getMacros(): Macro[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MACROS);
      if (data) return JSON.parse(data);
    } catch {}

    // Default macro presets
    return [
      {
        id: 'm_vat',
        name: 'Sales Tax / VAT (10%)',
        description: 'Applies 10% sales tax and rounds to 2 decimals',
        steps: [
          { id: '1', action: 'tax', value: 10, description: '+10% Tax' },
          { id: '2', action: 'round', value: 2, description: 'Round to 2 decimals' },
        ],
      },
      {
        id: 'm_discount_tip',
        name: '20% Off + 15% Tip',
        description: 'Applies 20% discount then adds 15% gratuity',
        steps: [
          { id: '1', action: 'multiply', value: 0.8, description: '20% Discount' },
          { id: '2', action: 'tax', value: 15, description: '+15% Tip' },
          { id: '3', action: 'round', value: 2, description: 'Round to 2 decimals' },
        ],
      },
    ];
  }

  static saveMacros(macros: Macro[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MACROS, JSON.stringify(macros));
    } catch (e) {
      console.warn('Failed to save macros', e);
    }
  }

  static exportAllData(): string {
    const backup = {
      history: this.getHistory(),
      workspaces: this.getWorkspaces(),
      macros: this.getMacros(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(backup, null, 2);
  }

  static importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.history) this.saveHistory(data.history);
      if (data.workspaces) this.saveWorkspaces(data.workspaces);
      if (data.macros) this.saveMacros(data.macros);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }
}
