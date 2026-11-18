import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { SettingsRepository } from '../data/repositories/SettingsRepository';
import { lightColors, darkColors } from './colors';

// Глобальное состояние темы. Работает как общий ViewModel:
// хранение выбора делегировано SettingsRepository.
const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
  colors: lightColors,
});

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    SettingsRepository.isDarkTheme()
      .then((saved) => {
        if (saved !== null) setIsDark(saved);
      })
      .catch((e) => console.warn('Ошибка загрузки темы:', e));
  }, []);

  const toggleTheme = useCallback(async () => {
    const next = !isDark;
    setIsDark(next);
    try {
      await SettingsRepository.setDarkTheme(next);
    } catch (e) {
      console.warn('Ошибка сохранения темы:', e);
    }
  }, [isDark]);

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
