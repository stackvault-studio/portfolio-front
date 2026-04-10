import React from 'react';
import { motion } from 'framer-motion';

const TimelineLine = ({ totalItems, currentVisibleIndex }) => {
  const lineVariants = {
    hidden: { height: 0 },
    visible: {
      height: '100%',
      transition: {
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  };

  const dotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (index) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: index * 0.2,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  // Calculate vertical position to align with card centers
  // Assuming cards have h-[500px] height and standard spacing
  const calculateDotPosition = (index) => {
    const cardHeight = 500; // matches h-[500px] from TimelineCard
    const cardSpacing = 24; // gap between cards (adjust based on your spacing)
    const headerOffset = 100; // offset from top to first card center
    
    const totalHeight = (totalItems * (cardHeight + cardSpacing)) - cardSpacing;
    const cardCenter = headerOffset + (index * (cardHeight + cardSpacing)) + (cardHeight / 2);
    
    return cardCenter;
  };

  return (
    <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-px pointer-events-none">
      {/* Main Timeline Line */}
      <motion.div
        className="w-full bg-gradient-to-b from-primary via-secondary to-accent opacity-30"
        variants={lineVariants}
        initial="hidden"
        animate="visible"
      />
      
      {/* Timeline Dots */}
      <div className="absolute inset-0">
        {Array.from({ length: totalItems })?.map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg -translate-x-1/2 z-20"
            style={{ 
              top: `${calculateDotPosition(index)}px`,
              left: '50%'
            }}
            variants={dotVariants}
            initial="hidden"
            animate={index <= currentVisibleIndex ? "visible" : "hidden"}
            custom={index}
          />
        ))}
      </div>
      
      {/* Animated Progress Indicator */}
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-primary to-secondary rounded-full shadow-md"
        initial={{ height: 0 }}
        animate={{ 
          height: currentVisibleIndex >= 0 ? `${calculateDotPosition(currentVisibleIndex)}px` : 0
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
};

export default TimelineLine;