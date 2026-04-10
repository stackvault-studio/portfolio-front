import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const ThemeToggle = ({ className = '' }) => {
  const [theme, setTheme] = useState('dark');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement?.classList?.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    setIsTransitioning(true);
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    
    // Add transition class to root
    document.documentElement?.style?.setProperty('--theme-transition', 'all 0.3s ease');
    
    setTimeout(() => {
      setTheme(newTheme);
      document.documentElement?.classList?.toggle('dark', newTheme === 'dark');
      localStorage.setItem('theme', newTheme);
      
      setTimeout(() => {
        setIsTransitioning(false);
        document.documentElement?.style?.removeProperty('--theme-transition');
      }, 300);
    }, 50);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      disabled={isTransitioning}
      className={`transition-all duration-200 hover:scale-105 ${className}`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <Icon 
        name={theme === 'dark' ? 'Sun' : 'Moon'} 
        size={18} 
        className={`transition-transform duration-300 ${isTransitioning ? 'rotate-180' : ''}`}
      />
    </Button>
  );
};

export default ThemeToggle;