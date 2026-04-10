import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TechnologyCard = ({ technology, onHover, isHovered, onSelectTechnology }) => {
  const [imageError, setImageError] = useState(false);
  

  const getProficiencyColor = (level) => {
    switch (level) {
      case 'expert': return 'text-accent';
      case 'intermediate': return 'text-warning';
      case 'beginner': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getProficiencyBg = (level) => {
    switch (level) {
      case 'expert': return 'bg-accent/10';
      case 'intermediate': return 'bg-warning/10';
      case 'beginner': return 'bg-muted/20';
      default: return 'bg-muted/20';
    }
  };

  const getExperienceIcon = (years) => {
    // support numbers or localized strings like "2 years", "11 months", "2 ans"
    if (typeof years === 'number') {
      if (years >= 5) return 'Crown';
      if (years >= 3) return 'Star';
      return 'Zap';
    }
    if (typeof years === 'string') {
      const parsed = parseInt(years, 10);
      if (!isNaN(parsed)) {
        if (parsed >= 5) return 'Crown';
        if (parsed >= 3) return 'Star';
      }
    }
    return 'Zap';
  };

  // display years: if number show "N year(s)" else show provided localized string
  const displayYears = (years) => {
    if (typeof years === 'number') {
      return `${years} year${years !== 1 ? 's' : ''}`;
    }
    return years || '';
  };

  return (
    
    <div
      className={`group overflow-visible relative bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 cursor-pointer ${
        isHovered ? 'scale-105 shadow-lg shadow-primary/10 border-primary/30' : ''
      }`}
      onMouseEnter={() => onHover(technology?.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelectTechnology(technology)}
    >
      {/* Technology Icon/Logo */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {!imageError && technology?.logo ? (
            <Image
              src={`/assets/images/technologies/${technology.name.replace(/\s+/g, '').toLowerCase()}.png`}
              alt={`${technology?.name} logo`}
              className="w-10 h-10 rounded-lg object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Code2" size={20} className="text-primary" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-foreground">{technology?.name}</h3>
            <p className="text-xs text-muted-foreground">{technology?.category}</p>
          </div>
        </div>
        
        {/* Recent Usage Indicator */}
        {technology?.recentlyUsed && (
          <div className="w-3 h-3 bg-accent rounded-full animate-pulse" title="Recently used" />
        )}
      </div>
      {/* Proficiency Level */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Proficiency</span>
          <span className={`text-sm font-medium capitalize ${getProficiencyColor(technology?.proficiency)}`}>
            {technology?.proficiency}
          </span>
        </div>
        <div className="w-full bg-muted/30 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              technology?.proficiency === 'expert' ? 'bg-accent w-full' :
              technology?.proficiency === 'intermediate'? 'bg-warning w-3/4' : 'bg-muted-foreground w-1/2'
            }`}
          />
        </div>
      </div>
      {/* Experience and Projects */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name={getExperienceIcon(technology?.yearsOfExperience)} size={16} className="text-primary" />
          <span className="text-sm text-muted-foreground">
            {displayYears(technology?.yearsOfExperience)}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="FolderOpen" size={16} className="text-secondary" />
          <span className="text-sm text-muted-foreground">
            {technology?.projectsCount} project{technology?.projectsCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {technology?.tags?.slice(0, 3)?.map((tag, index) => (
          <span
            key={index}
            className={`px-2 py-1 text-xs rounded-full ${getProficiencyBg(technology?.proficiency)} ${getProficiencyColor(technology?.proficiency)}`}
          >
            {tag}
          </span>
        ))}
        {technology?.tags?.length > 3 && (
          <span className="px-2 py-1 text-xs rounded-full bg-muted/20 text-muted-foreground">
            +{technology?.tags?.length - 3}
          </span>
        )}
      </div>
      {/* Last Used */}
      <div className="text-xs text-muted-foreground">
        Last used: {technology?.lastUsed}
      </div>


      
    </div>
  );
};

export default TechnologyCard;