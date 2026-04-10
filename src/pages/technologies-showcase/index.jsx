import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import FilterBar from './components/FilterBar';
import TechnologyCard from './components/TechnologyCard';
import SkillsRadarChart from './components/SkillsRadarChart';
import CategorySection from './components/CategorySection';
import Header from '../../components/ui/Header';
import ScrollProgressIndicator from '../../components/ui/ScrollProgressIndicator';
import { useLanguage } from '../../contexts/LanguageContext';
import { getTechnologies } from '../../services/technologyService';
import Image from '../../components/AppImage';

const TechnologiesShowcase = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProficiency, setSelectedProficiency] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [hoveredTech, setHoveredTech] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [isSticky, setIsSticky] = useState(false);

  const [technologies, setTechnologies] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedTech, setSelectedTech] = useState(null);

  // Fetch once
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getTechnologies(); // returns { technologies, stats }

        const normalized = (response?.technologies || []).map((t, idx) => {
          const categoryValue = t?.category ? String(t.category).toLowerCase() : 'uncategorized';
          const categoryLabel = categoryValue.charAt(0).toUpperCase() + categoryValue.slice(1);

          return {
            id: t?.id ?? `api-${idx}`,
            name: t?.name ?? '',
            category: categoryLabel,
            proficiency: (t?.proficiency ?? '').toString().toLowerCase(),
            yearsOfExperience: t?.yearsOfExperience?.[language] ?? '',
            projectsCount: t?.projectsCount ?? 0,
            recentlyUsed: !!t?.recentlyUsed,
            lastUsed: t?.lastUsed?.[language] ?? '',
            logo: t?.logo ?? '',
            tags: Array.isArray(t?.tags) ? t.tags : [],
            recentProjects: (t?.recentProjects || []).map(r =>
              typeof r === 'object' ? r?.[language] ?? Object.values(r)[0] : r
            )
          };
        });

        setTechnologies(normalized);
        setStats(response?.stats ?? null);
      } catch (error) {
        console.error('Failed to fetch technologies:', error);
        setTechnologies([]);
        setStats(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [language]);

  // Sticky filter bar
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 200);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onSelectTechnology = (tech) => {
    setSelectedTech(tech);
  };

  // Categories
  const categories = useMemo(() => {
    const set = new Set();
    (technologies || []).forEach(t => {
      if (t?.category) set.add(t.category);
    });
    return Array.from(set).sort();
  }, [technologies]);

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

  // Filter + sort
  const filteredTechnologies = useMemo(() => {
    let filtered = (technologies || []).filter(tech => {
      const lowerSearch = (searchTerm || '').toLowerCase();
      const matchesSearch =
        tech?.name?.toLowerCase()?.includes(lowerSearch) ||
        tech?.category?.toLowerCase()?.includes(lowerSearch) ||
        tech?.tags?.some(tag => tag?.toLowerCase()?.includes(lowerSearch));

      const matchesCategory = selectedCategory === 'all' || tech?.category === selectedCategory;
      const matchesProficiency = selectedProficiency === 'all' || tech?.proficiency === selectedProficiency;

      return matchesSearch && matchesCategory && matchesProficiency;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'experience':
          return (parseInt(b?.yearsOfExperience) || 0) - (parseInt(a?.yearsOfExperience) || 0);
        case 'recent':
          if (a?.recentlyUsed && !b?.recentlyUsed) return -1;
          if (!a?.recentlyUsed && b?.recentlyUsed) return 1;
          return 0;
        case 'projects':
          return b?.projectsCount - a?.projectsCount;
        case 'name':
        default:
          return (a?.name ?? '').localeCompare(b?.name ?? '');
      }
    });

    return filtered;
  }, [technologies, searchTerm, selectedCategory, selectedProficiency, sortBy]);

  // Group by category
  const technologiesByCategory = useMemo(() => {
    const grouped = {};
    filteredTechnologies.forEach(tech => {
      if (!grouped[tech.category]) grouped[tech.category] = [];
      grouped[tech.category].push(tech);
    });
    return grouped;
  }, [filteredTechnologies]);
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading technologies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <Header />
      <ScrollProgressIndicator />

      {/* Header Section */}
      <div className="bg-gradient-to-br from-background via-muted/20 to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            <div className="flex-1">
              {/* Title + Subtitle */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Icon name="Code2" size={24} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {language === 'fr' ? 'Vitrine Technologique' : 'Technologies Showcase'}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {language === 'fr'
                      ? 'Expertise technique complète en développement backend, infrastructure cloud et pratiques modernes'
                      : 'Comprehensive technical expertise across backend development, cloud infrastructure, and modern practices'}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{stats?.technologiesCount}</div>
                  <div className="text-xs text-muted-foreground">Technologies</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-accent">{stats?.expertProficiencyCount}</div>
                  <div className="text-xs text-muted-foreground">Expert Level</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-secondary">{stats?.categoriesCount}</div>
                  <div className="text-xs text-muted-foreground">Categories</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-warning">{stats?.certificationCount}</div>
                  <div className="text-xs text-muted-foreground">Certifications</div>
                </div>
              </div>
            </div>

            {/* Skills Radar Chart */}
            <div className="w-full lg:w-96">
              <SkillsRadarChart data={stats?.technologySkillOverviewList || []} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedProficiency={selectedProficiency}
        setSelectedProficiency={setSelectedProficiency}
        sortBy={sortBy}
        setSortBy={setSortBy}
        categories={categories}
        isSticky={isSticky}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* View Mode Toggle */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-sm text-muted-foreground">
            Showing {filteredTechnologies?.length} of {technologies?.length} technologies
          </span>

          <div className="flex items-center space-x-2 bg-card border border-border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Icon name="Grid3X3" size={16} className="mr-2" />
              {language === 'fr' ? 'Vue Grille' : 'Grid View'}
            </Button>
            <Button
              variant={viewMode === 'category' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('category')}
            >
              <Icon name="List" size={16} className="mr-2" />
              {language === 'fr' ? 'Vue Catégorie' : 'Category View'}
            </Button>
          </div>
        </div>

        {/* Technologies Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTechnologies?.map((tech) => (
              <TechnologyCard
                key={tech?.id}
                technology={tech}
                onHover={setHoveredTech}
                isHovered={hoveredTech === tech?.id}
                onSelectTechnology={setSelectedTech}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(technologiesByCategory)?.map(([category, techs]) => (
              <CategorySection
                key={category}
                category={category}
                technologies={techs}
                hoveredTech={hoveredTech}
                setHoveredTech={setHoveredTech}
              />
            ))}
          </div>
        )}

        {selectedTech && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg shadow-xl relative 
                  max-h-[90vh] overflow-y-auto">

              <button
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                onClick={() => setSelectedTech(null)}
              >
                ✕
              </button>


              {/* Header */}
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src={`/assets/images/technologies/${selectedTech.name.replace(/\s+/g, '').toLowerCase()}.png`}
                  alt={`${selectedTech.name} logo`}
                  className="w-12 h-12 rounded-lg object-contain"
                />
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{selectedTech.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedTech.category}</p>
                </div>
              </div>

              {/* Proficiency */}
              <div className="mb-4">
                <span className="text-sm text-muted-foreground">Proficiency:</span>
                <span className={`ml-2 text-sm font-medium ${getProficiencyColor(selectedTech.proficiency)}`}>
                  {selectedTech.proficiency}
                </span>
              </div>

              {/* Full Tags */}
              <div className="mb-4">
                <h3 className="font-medium text-foreground mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTech.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 text-xs rounded-full ${getProficiencyBg(selectedTech.proficiency)} ${getProficiencyColor(selectedTech.proficiency)}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Projects */}
              {selectedTech.recentProjects?.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-foreground mb-2">Recent Projects</h3>
                  <div className="space-y-3">
                    {selectedTech.recentProjects.map((project, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg border border-border bg-muted/10 flex items-center space-x-2"
                      >
                        <Icon name="Dot" size={12} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{project}</span>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* Last Used */}
              <div className="text-xs text-muted-foreground">
                Last used: {selectedTech.lastUsed}
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredTechnologies?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No technologies found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedProficiency('all');
                setSortBy('name');
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AO</span>
              </div>
              <span className="text-lg font-semibold text-foreground">Abdennadher Oussama</span>
            </div>
            <p className="text-muted-foreground">
              {language === 'fr' ? 'Développeur FullStack Senior • Spécialiste Java & BPM' : 'Senior FullStack Developer • Java & BPM Specialist'
              }
            </p>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <span>© {new Date()?.getFullYear()} Abdennadher Oussama</span>
              <span>•</span>
              <span>{language === 'fr' ? 'Tous droits réservés' : 'All rights reserved'}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>

  );
};

export default TechnologiesShowcase;