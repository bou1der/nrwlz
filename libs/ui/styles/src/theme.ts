import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const pallete = {
  primary: {
    50: '#eff9ff',
    100: '#dbf1fe',
    200: '#bfe7fe',
    300: '#92dafe',
    400: '#5fc3fb',
    500: '#3aa6f7',
    600: '#2489ec',
    700: '#1c71d8',
    800: '#1d5cb0',
    900: '#1d4f8b',
    950: '#0c4a6e',
  },
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  light: {
    primary: {
      0: '#ffffff',
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
  dark: {
    primary: {
      0: '#0f172a',
      50: '#1e293b',
      100: '#334155',
      200: '#475569',
      300: '#64748b',
      400: '#94a3b8',
      500: '#cbd5e1',
      600: '#e2e8f0',
      700: '#f1f5f9',
      800: '#f8fafc',
      900: '#ffffff',
    },
  }
} as const;

export const GlobalNGPreset = definePreset(Aura, {
  semantic: {
    primary: pallete.primary,
    success: { value: pallete.success },
    warning: { value: pallete.warning },
    danger: { value: pallete.danger },
    colorScheme: {
      light: pallete.light,
      dark: pallete.dark,
    }
  },
});
