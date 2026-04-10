import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const LanguageSwitcher = ({ className = '', onLanguageChange }) => {
  const [language, setLanguage] = useState('en');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const languages = {
    en: { label: 'English', flag: '🇺🇸', code: 'EN' },
    fr: { label: 'Français', flag: '🇫🇷', code: 'FR' }
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const toggleLanguage = () => {
    setIsTransitioning(true);
    const newLanguage = language === 'en' ? 'fr' : 'en';
    
    setTimeout(() => {
      setLanguage(newLanguage);
      localStorage.setItem('language', newLanguage);
      
      if (onLanguageChange) {
        onLanguageChange(newLanguage);
      }
      
      // Dispatch custom event for other components to listen
      window.dispatchEvent(new CustomEvent('languageChange', { 
        detail: { language: newLanguage } 
      }));
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 200);
    }, 100);
  };

  const currentLang = languages?.[language];

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      disabled={isTransitioning}
      className={`transition-all duration-200 hover:scale-105 ${className}`}
      aria-label={`Switch to ${language === 'en' ? 'French' : 'English'}`}
    >
      <Icon name="Languages" size={16} className="mr-2" />
      <span className={`transition-opacity duration-200 ${isTransitioning ? 'opacity-50' : ''}`}>
        {currentLang?.code}
      </span>
    </Button>
  );
};

export default LanguageSwitcher;