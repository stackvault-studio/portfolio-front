import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('portfolio-home-dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [theme, setTheme] = useState('dark');
  const { language, changeLanguage } = useLanguage();

  const navigationItems = [
    {
      id: 'portfolio-home-dashboard',
      label: { en: 'Home', fr: 'Accueil' },
      href: '/',
      icon: 'Home'
    },
    {
      id: 'work-experience-timeline',
      label: { en: 'Experience', fr: 'Expérience' },
      href: '/work-experience-timeline',
      icon: 'Briefcase'
    },
    {
      id: 'education-certifications',
      label: { en: 'Education', fr: 'Formation' },
      href: '/education-certifications',
      icon: 'GraduationCap'
    },
    {
      id: 'technologies-showcase',
      label: { en: 'Technologies', fr: 'Technologies' },
      href: '/technologies-showcase',
      icon: 'Code'
    },
    {
      id: 'mission-rate-calculator',
      label: { en: 'AI Mission Matching Evaluator', fr: 'Évaluateur de Correspondance de Mission IA' },
      href: '/mission-rate-calculator',
      icon: 'Sparkles'
    }
  ];

  useEffect(() => {
    // Update active section based on route
    const pathToSection = {
      '/': 'portfolio-home-dashboard',
      '/work-experience-timeline': 'work-experience-timeline',
      '/education-certifications': 'education-certifications',
      '/technologies-showcase': 'technologies-showcase',
      '/mission-rate-calculator': 'mission-rate-calculator',
    };
    if (pathToSection[location.pathname]) {
      setActiveSection(pathToSection[location.pathname]);
    } else {
      // fallback to scroll-based section for anchor navigation
      const handleScroll = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement?.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        setScrollProgress(Math.min(progress, 100));
        const sections = navigationItems?.map(item => item?.id);
        let currentSection = sections?.[0];
        for (const sectionId of sections) {
          const element = document.getElementById(sectionId);
          if (element) {
            const rect = element?.getBoundingClientRect();
            if (rect?.top <= 100) {
              currentSection = sectionId;
            }
          }
        }
        setActiveSection(currentSection);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [location.pathname]);

  const handleNavClick = (href) => {
    if (href.startsWith('/')) {
      window.location.href = href;
    } else {
      const targetId = href?.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
    setIsMenuOpen(false);
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'fr' : 'en';
    changeLanguage(newLanguage);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement?.classList?.toggle('dark', savedTheme === 'dark');
  }, []);

  return (
    <>
      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-muted z-[999]">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-smooth"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      {/* Header */}
      <header className="fixed top-1 left-0 right-0 z-[1000] bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Code2" size={24} color="white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold text-foreground">Oussama A.</h1>
                <p className="text-xs text-muted-foreground">FullStack Developer</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems?.map((item) => (
                <button
                  key={item?.id}
                  onClick={() => handleNavClick(item?.href)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    activeSection === item?.id
                      ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon name={item?.icon} size={16} />
                  <span>{item?.label?.[language]}</span>
                </button>
              ))}
            </nav>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="hidden sm:flex"
              >
                <Icon name="Languages" size={16} className="mr-2" />
                {language?.toUpperCase()}
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden"
              >
                <Icon name={isMenuOpen ? 'X' : 'Menu'} size={20} />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-card border-t border-border shadow-elevation-2">
            <div className="px-6 py-4 space-y-2">
              {navigationItems?.map((item) => (
                <button
                  key={item?.id}
                  onClick={() => handleNavClick(item?.href)}
                  className={`flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeSection === item?.id
                      ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.label?.[language]}</span>
                </button>
              ))}
              
              {/* Mobile Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="flex items-center space-x-2"
                >
                  <Icon name="Languages" size={16} />
                  <span>{language === 'en' ? 'Français' : 'English'}</span>
                </Button>
                
                
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;