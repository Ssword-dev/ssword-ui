import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface ThemeSettings {
  mode: string;
}

interface ClientThemeContext {
  themeSettings: ThemeSettings;
  setThemeMode: (mode: string) => void;
  cache: Map<string, string>;
}

const ThemeContext = createContext<ClientThemeContext | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState('light');
  const cache = useRef(new Map<string, string>());
  const controller = useRef<AbortController | null>(null);
  const observer = useRef<MutationObserver | null>(null);

  const applyStyle = (cssText: string) => {
    const styleEl = document.getElementById('theme-style') || createStyleElement();
    styleEl.innerHTML = cssText;
  };

  const createStyleElement = () => {
    const el = document.createElement('style');
    el.id = 'theme-style';
    el.setAttribute('data-theme', 'dynamic');
    document.head.appendChild(el);
    return el;
  };

  const fetchTheme = async (themeMode: string) => {
    if (controller.current) controller.current.abort();
    const currentController = new AbortController();
    controller.current = currentController;

    try {
      const res = await fetch(`/themes/${themeMode}.css`, {
        signal: currentController.signal,
        cache: 'no-cache',
      });
      if (!res.ok) throw new Error(`Failed to fetch theme: ${res.status}`);
      const cssText = await res.text();
      cache.current.set(themeMode, cssText);

      if (controller.current === currentController) {
        applyStyle(cssText);
        controller.current = null;
      }
    } catch (e: any) {
      if (e.name === 'AbortError') return;
      console.error('Theme fetch failed', e);
    }
  };

  useEffect(() => {
    // initial load
    const cached = cache.current.get(mode);
    if (cached) applyStyle(cached);
    else fetchTheme(mode);

    // observer to repair removed style
    observer.current = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.removedNodes.forEach((node) => {
          if (
            node instanceof HTMLElement &&
            node.id === 'theme-style'
          ) {
            const css = cache.current.get(mode);
            if (css) applyStyle(css);
          }
        });
      }
    });
    observer.current.observe(document.head, { childList: true });

    return () => {
      controller.current?.abort();
      observer.current?.disconnect();
    };
  }, [mode]);

  const value: ClientThemeContext = {
    themeSettings: { mode },
    setThemeMode: setMode,
    cache: cache.current,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
