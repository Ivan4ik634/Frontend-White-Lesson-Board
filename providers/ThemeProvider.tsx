'use client';

import { useTheme } from '@/store/useTheme';
import { FC, useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}

const ThemeProvider: FC<Props> = ({ children }) => {
  const { theme } = useTheme();
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
  }, [theme]);
  return <>{children}</>;
};

export default ThemeProvider;
