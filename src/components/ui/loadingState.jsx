import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const LoadingState = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
        <p className="text-muted-foreground">
          {language === 'fr' ? 'Chargement du portfolio...' : 'Loading portfolio...'}
        </p>
      </div>
    </div>
  );
};

export default LoadingState;