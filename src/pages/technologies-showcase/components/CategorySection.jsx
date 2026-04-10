import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import TechnologyCard from './TechnologyCard';

const CategorySection = ({ category, technologies, hoveredTech, setHoveredTech, onSelectTechnology }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Backend': 'Server',
      'Database': 'Database',
      'Cloud': 'Cloud',
      'DevOps': 'Settings',
      'Frontend': 'Monitor',
      'Mobile': 'Smartphone',
      'Testing': 'TestTube',
      'Tools': 'Wrench',
      'Languages': 'Code2',
      'Frameworks': 'Layers'
    };
    return iconMap?.[categoryName] || 'Code';
  };

  const getCategoryStats = () => {
    const expertCount = technologies?.filter(t => t?.proficiency === 'expert')?.length;
    const avgExperience = Math.round(
      technologies?.reduce((sum, t) => sum + t?.yearsOfExperience, 0) / technologies?.length * 10
    ) / 10;
    const recentlyUsedCount = technologies?.filter(t => t?.recentlyUsed)?.length;

    return { expertCount, avgExperience, recentlyUsedCount };
  };

  const stats = getCategoryStats();

  return (
    <div className="mb-8">
      {/* Category Header */}
      <div 
        className="flex items-center justify-between p-4 bg-card border border-border rounded-lg cursor-pointer hover:bg-muted/20 transition-colors duration-200 mb-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name={getCategoryIcon(category)} size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{category}</h3>
            <p className="text-sm text-muted-foreground">
              {technologies?.length} technolog{technologies?.length !== 1 ? 'ies' : 'y'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {/* Category Stats */}
          <div className="hidden md:flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Icon name="Crown" size={14} className="text-accent" />
              <span className="text-muted-foreground">{stats?.expertCount} expert</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="TrendingUp" size={14} className="text-secondary" />
              <span className="text-muted-foreground">{stats?.avgExperience}y avg</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} className="text-warning" />
              <span className="text-muted-foreground">{stats?.recentlyUsedCount} recent</span>
            </div>
          </div>

          {/* Expand/Collapse Icon */}
          <Icon 
            name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
            size={20} 
            className="text-muted-foreground transition-transform duration-200" 
          />
        </div>
      </div>
      {/* Technologies Grid */}
      <div className={`transition-all duration-300 overflow-hidden ${
        isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {technologies?.map((tech) => (
            <TechnologyCard
              key={tech?.id}
              technology={tech}
              onHover={setHoveredTech}
              isHovered={hoveredTech === tech?.id}
              onClick={() => onSelectTechnology(tech)}
            />
          ))}
        </div>
      </div>
      {/* Mobile Stats (shown when collapsed) */}
      {!isExpanded && (
        <div className="md:hidden flex items-center justify-center space-x-6 py-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Crown" size={14} className="text-accent" />
            <span>{stats?.expertCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="TrendingUp" size={14} className="text-secondary" />
            <span>{stats?.avgExperience}y</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={14} className="text-warning" />
            <span>{stats?.recentlyUsedCount}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySection;