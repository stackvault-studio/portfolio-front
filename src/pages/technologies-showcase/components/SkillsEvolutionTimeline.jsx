import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SkillsEvolutionTimeline = ({ technologies }) => {
  const [visibleYears, setVisibleYears] = useState(new Set());
  const [animationComplete, setAnimationComplete] = useState(false);

  // Process timeline data
  const processTimelineData = () => {
    const currentYear = new Date()?.getFullYear();
    const startYear = currentYear - 7;
    const timeline = [];

    for (let year = startYear; year <= currentYear; year++) {
      const yearTechs = technologies?.filter(tech => {
        const adoptionYear = currentYear - tech?.yearsOfExperience + 1;
        return adoptionYear === year;
      });

      if (yearTechs?.length > 0) {
        timeline?.push({
          year,
          technologies: yearTechs,
          isCurrentYear: year === currentYear
        });
      }
    }

    return timeline?.reverse(); // Most recent first
  };

  const timelineData = processTimelineData();

  useEffect(() => {
    // Animate timeline items
    const timer = setTimeout(() => {
      timelineData?.forEach((item, index) => {
        setTimeout(() => {
          setVisibleYears(prev => new Set([...prev, item.year]));
        }, index * 200);
      });
      
      setTimeout(() => {
        setAnimationComplete(true);
      }, timelineData?.length * 200 + 500);
    }, 500);

    return () => clearTimeout(timer);
  }, [timelineData?.length]);

  const getTechIcon = (category) => {
    const iconMap = {
      'Backend': 'Server',
      'Database': 'Database',
      'Cloud': 'Cloud',
      'DevOps': 'Settings',
      'Frontend': 'Monitor',
      'Mobile': 'Smartphone',
      'Testing': 'TestTube',
      'Tools': 'Wrench'
    };
    return iconMap?.[category] || 'Code';
  };

  const getProficiencyColor = (proficiency) => {
    switch (proficiency) {
      case 'expert': return 'text-accent border-accent';
      case 'intermediate': return 'text-warning border-warning';
      case 'beginner': return 'text-muted-foreground border-muted-foreground';
      default: return 'text-muted-foreground border-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Skills Evolution Timeline</h3>
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span>Expert</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-warning rounded-full"></div>
            <span>Intermediate</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
            <span>Beginner</span>
          </div>
        </div>
      </div>
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
        
        {/* Animated Progress Line */}
        <div 
          className="absolute left-8 top-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent transition-all duration-2000 ease-out"
          style={{ 
            height: animationComplete ? '100%' : '0%'
          }}
        ></div>

        <div className="space-y-8">
          {timelineData?.map((yearData, index) => (
            <div
              key={yearData?.year}
              className={`relative flex items-start space-x-6 transition-all duration-500 ${
                visibleYears?.has(yearData?.year) 
                  ? 'opacity-100 translate-x-0' :'opacity-0 translate-x-4'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Year Marker */}
              <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-2 transition-all duration-300 ${
                yearData?.isCurrentYear 
                  ? 'bg-primary border-primary text-white' :'bg-card border-border text-foreground'
              }`}>
                <div className="text-center">
                  <div className="text-sm font-bold">{yearData?.year}</div>
                  {yearData?.isCurrentYear && (
                    <div className="text-xs opacity-80">Now</div>
                  )}
                </div>
                
                {/* Pulse animation for current year */}
                {yearData?.isCurrentYear && (
                  <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-20"></div>
                )}
              </div>

              {/* Technologies for this year */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground mb-3">
                  Technologies Adopted ({yearData?.technologies?.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {yearData?.technologies?.map((tech, techIndex) => (
                    <div
                      key={tech?.id}
                      className={`flex items-center space-x-3 p-3 bg-muted/20 rounded-lg border transition-all duration-300 hover:shadow-md ${getProficiencyColor(tech?.proficiency)}`}
                      style={{ 
                        animationDelay: `${(index * 200) + (techIndex * 100)}ms`,
                        animation: visibleYears?.has(yearData?.year) ? 'slideInRight 0.5s ease-out forwards' : 'none'
                      }}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon name={getTechIcon(tech?.category)} size={16} className="text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">
                          {tech?.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {tech?.category} • {tech?.proficiency}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Summary */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-primary">{timelineData?.length}</div>
            <div className="text-xs text-muted-foreground">Active Years</div>
          </div>
          <div>
            <div className="text-xl font-bold text-secondary">
              {timelineData?.reduce((sum, year) => sum + year?.technologies?.length, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Total Adoptions</div>
          </div>
          <div>
            <div className="text-xl font-bold text-accent">
              {Math.round(timelineData?.reduce((sum, year) => sum + year?.technologies?.length, 0) / timelineData?.length)}
            </div>
            <div className="text-xs text-muted-foreground">Avg per Year</div>
          </div>
          <div>
            <div className="text-xl font-bold text-warning">
              {timelineData?.[0]?.technologies?.length || 0}
            </div>
            <div className="text-xs text-muted-foreground">This Year</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsEvolutionTimeline;