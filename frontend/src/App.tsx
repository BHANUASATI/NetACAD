import React from 'react';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AppRoutes } from './pages/AppRoutes';

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
