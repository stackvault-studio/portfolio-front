import React, { useState, useEffect } from 'react';

const ScrollProgressIndicator = ({ className = '', showPercentage = false }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement?.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      setScrollProgress(Math.min(Math.max(progress, 0), 100));
      setIsVisible(scrollTop > 100);
    };

    // Initial calculation
    handleScroll();

    // Throttled scroll listener for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div className={`fixed top-0 left-0 w-full h-1 bg-muted/30 z-[999] ${className}`}>
      <div 
        className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-300 ease-smooth shadow-sm"
        style={{ 
          width: `${scrollProgress}%`,
          opacity: isVisible ? 1 : 0.3
        }}
      />
      
      {showPercentage && isVisible && (
        <div className="absolute top-2 right-4 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
          {Math.round(scrollProgress)}%
        </div>
      )}
    </div>
  );
};

export default ScrollProgressIndicator;