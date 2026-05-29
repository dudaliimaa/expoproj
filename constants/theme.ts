/**
 * Below are the colors that are used in the app.
 * Laranja: #e67e22
 * Verde: #27ae60
 */

import { Platform } from 'react-native';

// Suas cores personalizadas
const brandOrange = '#e67e22';
const brandGreen = '#27ae60';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: brandGreen, // Usando o verde para destaques no modo claro
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: brandGreen,
  },
  dark: {
    text: '#ECEDEE',
    background: '#121212', // Um tom de cinza bem escuro, quase preto
    tint: brandGreen,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: brandGreen,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});