import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, Contrast } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative p-3 rounded-xl transition-all duration-300 transform hover:scale-110 ${
        theme === 'dark' 
          ? 'bg-gray-900 text-white border border-gray-700 shadow-gray-900/50 hover:shadow-gray-900/70' 
          : 'bg-white text-black border border-gray-300 shadow-gray-400/50 hover:shadow-gray-500/70'
      } shadow-lg`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="relative">
        {theme === 'dark' ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <Contrast className="w-5 h-5" />
        </div>
      </div>
    </button>
  );
};
