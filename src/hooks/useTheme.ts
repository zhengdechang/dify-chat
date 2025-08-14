import { useEffect, useRef } from "react";
import type { ChatTheme } from "../types";
import { lightTheme } from "../themes/presets";

export interface UseThemeOptions {
  theme?: ChatTheme;
  container?: HTMLElement | null;
}

export const useTheme = ({ theme, container }: UseThemeOptions = {}) => {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const targetContainer = container || containerRef.current;
    if (!targetContainer) return;

    const appliedTheme = { ...lightTheme, ...theme };

    // Apply CSS custom properties
    if (appliedTheme.primary) {
      targetContainer.style.setProperty("--primary", appliedTheme.primary);
    }
    if (appliedTheme.secondary) {
      targetContainer.style.setProperty("--secondary", appliedTheme.secondary);
    }
    if (appliedTheme.background) {
      targetContainer.style.setProperty(
        "--background",
        appliedTheme.background
      );
    }
    if (appliedTheme.text) {
      targetContainer.style.setProperty("--foreground", appliedTheme.text);
    }
    if (appliedTheme.border) {
      targetContainer.style.setProperty("--border", appliedTheme.border);
    }
    if (appliedTheme.borderRadius) {
      targetContainer.style.setProperty("--radius", appliedTheme.borderRadius);
    }
    if (appliedTheme.fontFamily) {
      targetContainer.style.fontFamily = appliedTheme.fontFamily;
    }

    // Cleanup function
    return () => {
      if (targetContainer) {
        targetContainer.style.removeProperty("--primary");
        targetContainer.style.removeProperty("--secondary");
        targetContainer.style.removeProperty("--background");
        targetContainer.style.removeProperty("--foreground");
        targetContainer.style.removeProperty("--border");
        targetContainer.style.removeProperty("--radius");
        targetContainer.style.removeProperty("font-family");
      }
    };
  }, [theme, container]);

  return containerRef;
};

export const applyThemeToElement = (element: HTMLElement, theme: ChatTheme) => {
  const appliedTheme = { ...lightTheme, ...theme };

  if (appliedTheme.primary) {
    element.style.setProperty("--primary", appliedTheme.primary);
  }
  if (appliedTheme.secondary) {
    element.style.setProperty("--secondary", appliedTheme.secondary);
  }
  if (appliedTheme.background) {
    element.style.setProperty("--background", appliedTheme.background);
  }
  if (appliedTheme.text) {
    element.style.setProperty("--foreground", appliedTheme.text);
  }
  if (appliedTheme.border) {
    element.style.setProperty("--border", appliedTheme.border);
  }
  if (appliedTheme.borderRadius) {
    element.style.setProperty("--radius", appliedTheme.borderRadius);
  }
  if (appliedTheme.fontFamily) {
    element.style.fontFamily = appliedTheme.fontFamily;
  }
};

export const removeThemeFromElement = (element: HTMLElement) => {
  element.style.removeProperty("--primary");
  element.style.removeProperty("--secondary");
  element.style.removeProperty("--background");
  element.style.removeProperty("--foreground");
  element.style.removeProperty("--border");
  element.style.removeProperty("--radius");
  element.style.removeProperty("font-family");
};
