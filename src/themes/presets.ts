/*
 * @Description:
 * @Author: Devin
 * @Date: 2025-08-13 20:20:26
 */
import type { ChatTheme } from "../types";

export const lightTheme: ChatTheme = {
  primary: "221.2 83.2% 53.3%",
  secondary: "210 40% 96%",
  background: "0 0% 100%",
  text: "222.2 84% 4.9%",
  border: "214.3 31.8% 91.4%",
  borderRadius: "0.5rem",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
};

export const darkTheme: ChatTheme = {
  primary: "210 100% 70%",
  secondary: "215 25% 15%",
  background: "220 13% 9%",
  text: "210 40% 98%",
  border: "215 25% 20%",
  borderRadius: "0.5rem",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
};

// Default theme is light theme
export const defaultTheme = lightTheme;

export const presetThemes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

export type PresetThemeName = keyof typeof presetThemes;
