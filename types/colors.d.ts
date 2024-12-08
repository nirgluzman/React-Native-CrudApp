import { type ColorSchemeName } from 'react-native'; // color scheme

// color values for each mode
type ColorTokens = {
  text: string; // Text Color Token
  background: string; // Background Color Token
  icon: string; // Icon Color Token
  button: string; // Button Color Token
};

export type ColorPalette = Record<ColorSchemeName, ColorTokens>;

export type ThemeContextType = {
  colorScheme: ColorModeName;
  theme: ColorTokens;
  setColorScheme: (scheme: ColorSchemeName) => void;
};
