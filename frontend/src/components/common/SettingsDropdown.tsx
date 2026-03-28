import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Settings, Moon, Sun, Globe, Check, ChevronDown, Contrast } from 'lucide-react';

export const SettingsDropdown: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'theme' | 'language'>('theme');

  const languages = [
    { code: 'en' as const, name: 'English', native: 'English' },
    { code: 'hi' as const, name: 'Hindi', native: 'हिन्दी' },
    { code: 'bn' as const, name: 'Bengali', native: 'বাংলা' },
    { code: 'te' as const, name: 'Telugu', native: 'తెలుగు' },
    { code: 'mr' as const, name: 'Marathi', native: 'मराठी' },
    { code: 'ta' as const, name: 'Tamil', native: 'தமிழ்' },
    { code: 'gu' as const, name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kn' as const, name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml' as const, name: 'Malayalam', native: 'മലയാളം' },
    { code: 'pa' as const, name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'or' as const, name: 'Odia', native: 'ଓଡ଼ିଆ' },
    { code: 'as' as const, name: 'Assamese', native: 'অসমীয়া' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
      >
        <Settings className="w-5 h-5" />
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-600 z-20">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-dark-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('common.settings')}
              </h3>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-dark-600">
              <button
                onClick={() => setActiveTab('theme')}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'theme'
                    ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {t('theme.toggle')}
              </button>
              <button
                onClick={() => setActiveTab('language')}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'language'
                    ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {t('language.select')}
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {activeTab === 'theme' && (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      toggleTheme();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {theme === 'light' ? (
                        <Sun className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <Moon className="w-5 h-5 text-blue-500" />
                      )}
                      <span className="text-gray-900 dark:text-white">
                        {theme === 'light' ? t('theme.light') : t('theme.dark')}
                      </span>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-primary-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary-500" />
                    </div>
                  </button>
                </div>
              )}

              {activeTab === 'language' && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        language === lang.code
                          ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700'
                          : 'border border-gray-200 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <div className="text-left">
                          <div className="text-gray-900 dark:text-white font-medium">
                            {lang.native}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {lang.name}
                          </div>
                        </div>
                      </div>
                      {language === lang.code && (
                        <Check className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 rounded-b-lg">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Current: {currentLanguage?.native}</span>
                <span>Theme: {theme === 'light' ? '☀️' : '🌙'}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
