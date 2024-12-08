import {
  Appearance, // exposes information about the user's appearance preferences, such as their preferred color scheme (light or dark)
  type ColorSchemeName,
} from 'react-native';

import {
  useState,
  createContext,
  ReactNode, // catch-all type for anything that can be rendered
  FC, // type of a functional component
} from 'react';

import { Colors } from '@/constants/Colors';
import { ThemeContextType } from '@/types/colors';

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        theme,
        setColorScheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};
