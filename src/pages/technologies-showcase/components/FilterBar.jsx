import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FilterBar = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory, 
  selectedProficiency, 
  setSelectedProficiency,
  sortBy,
  setSortBy,
  categories,
  isSticky 
}) => {
  const proficiencyLevels = [
    { value: 'all', label: 'All Levels' },
    { value: 'expert', label: 'Expert' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'beginner', label: 'Beginner' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name', icon: 'ArrowUpDown' },
    { value: 'experience', label: 'Experience', icon: 'TrendingUp' },
    { value: 'recent', label: 'Recently Used', icon: 'Clock' },
    { value: 'projects', label: 'Project Count', icon: 'FolderOpen' }
  ];

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedProficiency('all');
    setSortBy('name');
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || selectedProficiency !== 'all' || sortBy !== 'name';

  return (
    <div className={`bg-background/95 backdrop-blur-sm border-b border-border transition-all duration-300 ${
      isSticky ? 'sticky top-16 z-40 shadow-sm' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search technologies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Icon name="Filter" size={16} className="text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e?.target?.value)}
                className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Categories</option>
                {categories?.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Proficiency Filter */}
            <select
              value={selectedProficiency}
              onChange={(e) => setSelectedProficiency(e?.target?.value)}
              className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {proficiencyLevels?.map(level => (
                <option key={level?.value} value={level?.value}>{level?.label}</option>
              ))}
            </select>

            {/* Sort Options */}
            <div className="flex items-center space-x-1 bg-card border border-border rounded-lg p-1">
              {sortOptions?.map(option => (
                <Button
                  key={option?.value}
                  variant={sortBy === option?.value ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSortBy(option?.value)}
                  className="text-xs"
                >
                  <Icon name={option?.icon} size={14} className="mr-1" />
                  {option?.label}
                </Button>
              ))}
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                <Icon name="X" size={14} className="mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="ml-1 hover:bg-primary/20 rounded-full p-0.5">
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('all')} className="ml-1 hover:bg-secondary/20 rounded-full p-0.5">
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {selectedProficiency !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                Level: {selectedProficiency}
                <button onClick={() => setSelectedProficiency('all')} className="ml-1 hover:bg-accent/20 rounded-full p-0.5">
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;