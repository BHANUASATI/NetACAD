import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi' | 'bn' | 'te' | 'mr' | 'ta' | 'gu' | 'kn' | 'ml' | 'pa' | 'or' | 'as';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.tasks': 'Tasks',
    'nav.calendar': 'Calendar',
    'nav.progress': 'Progress',
    'nav.placements': 'Placements',
    'nav.library': 'Library',
    'nav.fees': 'Fees',
    'nav.attendance': 'Attendance',
    'nav.messages': 'Messages',
    'nav.services': 'Services',
    'nav.help': 'Help',
    'nav.logout': 'Logout',
    
    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.semester': 'Semester',
    'dashboard.tasks': 'Tasks',
    'dashboard.pending': 'Pending',
    'dashboard.completed': 'Completed',
    'dashboard.overdue': 'Overdue',
    'dashboard.totalTasks': 'Total Tasks',
    'dashboard.completionRate': 'Completion Rate',
    'dashboard.allCaughtUp': 'All caught up!',
    'dashboard.noPendingTasks': 'No pending tasks',
    'dashboard.noCompletedTasks': 'No completed tasks yet',
    'dashboard.startCompleting': 'Start completing tasks to see them here',
    
    // Library
    'library.title': 'Digital Library',
    'library.description': 'Access thousands of books, journals, and research papers',
    'library.digitalBooks': 'Digital Books',
    'library.researchPapers': 'Research Papers',
    'library.access247': '24/7 Access',
    'library.searchCatalog': 'Search Catalog',
    'library.findBooks': 'Find books and resources',
    'library.borrowedBooks': 'My Borrowed Books',
    'library.viewBorrowed': 'View borrowed items',
    
    // Fees
    'fees.title': 'Fee Management',
    'fees.management': 'Fee Management',
    'fees.description': 'Pay fees, view payment history, and download receipts',
    'fees.currentSemester': 'Current Semester Fees',
    'fees.paymentHistory': 'Payment History',
    'fees.payNow': 'Pay Now',
    'fees.dueDate': 'Due',
    
    // Attendance
    'attendance.title': 'Attendance Tracking',
    'attendance.tracking': 'Attendance Tracking',
    'attendance.description': 'Monitor your attendance and view detailed reports',
    'attendance.overall': 'Overall',
    'attendance.thisMonth': 'This Month',
    'attendance.classesAttended': 'Classes Attended',
    'attendance.classesMissed': 'Classes Missed',
    
    // Messages
    'messages.title': 'Messages',
    
    // Services
    'services.title': 'Campus Services',
    
    // Help
    'help.title': 'Help & Support',
    
    // Placements
    'placements.title': 'Placement Portal',
    
    // Task Status
    'task.pending': 'Pending',
    'task.completed': 'Completed',
    'task.overdue': 'Overdue',
    'task.dueDate': 'Due Date',
    'task.priority': 'Priority',
    'task.category': 'Category',
    'task.markComplete': 'Mark Complete',
    'task.markPending': 'Mark Pending',
    
    // Priority Levels
    'priority.high': 'High',
    'priority.medium': 'Medium',
    'priority.low': 'Low',
    
    // Categories
    'category.academic': 'Academic',
    'category.administrative': 'Administrative',
    'category.financial': 'Financial',
    'category.extracurricular': 'Extracurricular',
    
    // Theme
    'theme.toggle': 'Toggle Theme',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    
    // Language
    'language.select': 'Select Language',
    'language.english': 'English',
    'language.hindi': 'हिन्दी',
    'language.bengali': 'বাংলা',
    'language.telugu': 'తెలుగు',
    'language.marathi': 'मराठी',
    'language.tamil': 'தமிழ்',
    'language.gujarati': 'ગુજરાતી',
    'language.kannada': 'ಕನ್ನಡ',
    'language.malayalam': 'മലയാളം',
    'language.punjabi': 'ਪੰਜਾਬੀ',
    'language.odia': 'ଓଡ଼ିଆ',
    'language.assamese': 'অসমীয়া',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.settings': 'Settings',
    'common.profile': 'Profile',
    'common.notifications': 'Notifications',
    'common.help': 'Help',
    'common.about': 'About',
  },
  
  hi: {
    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.calendar': 'कैलेंडर',
    'nav.progress': 'प्रगति',
    'nav.placements': 'प्लेसमेंट्स',
    'nav.library': 'लाइब्रेरी',
    'nav.fees': 'फीस',
    'nav.logout': 'लॉग आउट',
    
    // Dashboard
    'dashboard.welcome': 'स्वागत है',
    'dashboard.semester': 'सेमेस्टर',
    'dashboard.tasks': 'कार्य',
    'dashboard.pending': 'लंबित',
    'dashboard.completed': 'पूर्ण',
    'dashboard.overdue': 'अतिक्रम',
    'dashboard.totalTasks': 'कुल कार्य',
    'dashboard.completionRate': 'पूर्णता दर',
    'dashboard.allCaughtUp': 'सब कुछ पूरा हो गया!',
    'dashboard.noPendingTasks': 'कोई लंबित कार्य नहीं',
    'dashboard.noCompletedTasks': 'अभी तक कोई पूर्ण कार्य नहीं',
    'dashboard.startCompleting': 'उन्हें यहां देखने के लिए कार्य पूरा करना शुरू करें',
    
    // Task Status
    'task.pending': 'लंबित',
    'task.completed': 'पूर्ण',
    'task.overdue': 'अतिक्रम',
    'task.dueDate': 'नियत तिथि',
    'task.priority': 'प्राथमिकता',
    'task.category': 'श्रेणी',
    'task.markComplete': 'पूर्ण चिह्नित करें',
    'task.markPending': 'लंबित चिह्नित करें',
    
    // Priority Levels
    'priority.high': 'उच्च',
    'priority.medium': 'मध्यम',
    'priority.low': 'निम्न',
    
    // Categories
    'category.academic': 'शैक्षणिक',
    'category.administrative': 'प्रशासनिक',
    'category.financial': 'वित्तीय',
    'category.extracurricular': 'अतिरिक्त पाठ्यक्रम',
    
    // Theme
    'theme.toggle': 'थीम टॉगल करें',
    'theme.light': 'हल्का',
    'theme.dark': 'अंधेरा',
    
    // Language
    'language.select': 'भाषा चुनें',
    'language.english': 'English',
    'language.hindi': 'हिन्दी',
    'language.bengali': 'বাংলা',
    'language.telugu': 'తెలుగు',
    'language.marathi': 'मराठी',
    'language.tamil': 'தமிழ்',
    'language.gujarati': 'ગુજરાતી',
    'language.kannada': 'ಕನ್ನಡ',
    'language.malayalam': 'മലയാളം',
    'language.punjabi': 'ਪੰਜਾਬੀ',
    'language.odia': 'ଓଡ଼ିଆ',
    'language.assamese': 'অসমীয়া',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.cancel': 'रद्द करें',
    'common.save': 'सहेजें',
    'common.edit': 'संपादित करें',
    'common.delete': 'हटाएं',
    'common.view': 'देखें',
    'common.search': 'खोजें',
    'common.filter': 'फ़िल्टर',
    'common.sort': 'क्रमबद्ध करें',
    'common.settings': 'सेटिंग्स',
    'common.profile': 'प्रोफ़ाइल',
    'common.notifications': 'सूचनाएं',
    'common.help': 'सहायता',
    'common.about': 'के बारे में',
  },
  
  // Add placeholder for other languages
  bn: {},
  te: {},
  mr: {},
  ta: {},
  gu: {},
  kn: {},
  ml: {},
  pa: {},
  or: {},
  as: {},
};

const rtlLanguages: Language[] = []; // Add RTL languages if needed

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0] as Language;
      if (translations[browserLang]) {
        setLanguage(browserLang);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[language]?.[key];
    return translation || translations['en'][key] || key;
  };

  const isRTL = rtlLanguages.includes(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};
