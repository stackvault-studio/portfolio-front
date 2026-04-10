import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TechnologyFilter = ({ 
  experiences, 
  onTechHighlight, 
  highlightedTech,
  onClientHighlight, 
  highlightedClient, 
  language = 'en'
}) => {
  const [searchTermClients, setSearchTermClients] = useState(''); // Search term for clients
  const [searchTermTechs, setSearchTermTechs] = useState(''); // Search term for technologies
  const [isExpandedClients, setIsExpandedClients] = useState(false);
  const [isExpandedTechs, setIsExpandedTechs] = useState(false);
  const [clientStats, setClientStats] = useState([]);
  const [techStats, setTechStats] = useState([]);

  const content = {
    en: {
      title: 'Filter',
      searchPlaceholder: 'Search...',
      clearFilter: 'Clear Filter',
      showAll: 'Show All',
      showLess: 'Show Less',
      yearsExp: 'years exp',
      projects: 'projects',
      clients: 'projects',
      technologies: 'Technologies'
    },
    fr: {
      title: 'Filtre',
      searchPlaceholder: 'Rechercher...',
      clearFilter: 'Effacer Filtre',
      showAll: 'Tout Afficher',
      showLess: 'Afficher Moins',
      yearsExp: 'ans exp',
      projects: 'projets',
      clients: 'projets',
      technologies: 'Technologies'
    }
  };

  // Calculate client statistics
  useEffect(() => {
    const map = new Map();
    experiences?.forEach(exp => {
      exp?.clients?.forEach(client => {
        if (!map?.has(client)) {
          map?.set(client, {
            name: client,
            count: 0,
            companies: new Set()
          });
        }

        const data = map?.get(client);
        data.count += 1;
        data?.companies?.add(exp?.company);
      });
    });

    const statsArray = Array.from(map?.values())?.map(item => ({
      ...item,
      companies: Array.from(item?.companies)
    }))?.sort((a, b) => b?.count - a?.count);

    setClientStats(statsArray);
  }, [experiences]);

  // Calculate technology statistics
  useEffect(() => {
    const map = new Map();
    experiences?.forEach(exp => {
      exp?.technologies?.forEach(tech => {
        if (!map?.has(tech)) {
          map?.set(tech, {
            name: tech,
            count: 0,
            totalDuration: 0,
            companies: new Set()
          });
        }

        const data = map?.get(tech);
        data.count += 1;
        data?.companies?.add(exp?.company);

        // Calculate duration in months (approximate)
        const start = new Date(exp.startDate);
        const end = exp?.endDate ? new Date(exp.endDate) : new Date();
        const months = (end?.getFullYear() - start?.getFullYear()) * 12 + 
                      (end?.getMonth() - start?.getMonth());
        data.totalDuration += months;
      });
    });

    const statsArray = Array.from(map?.values())?.map(item => ({
      ...item,
      companies: Array.from(item?.companies),
      yearsExperience: Math.round(item?.totalDuration / 12 * 10) / 10
    }))?.sort((a, b) => b?.yearsExperience - a?.yearsExperience);

    setTechStats(statsArray);
  }, [experiences]);

  const filteredClients = clientStats?.filter(item =>
    item?.name?.toLowerCase()?.includes(searchTermClients?.toLowerCase())
  );

  const filteredTechs = techStats?.filter(item =>
    item?.name?.toLowerCase()?.includes(searchTermTechs?.toLowerCase())
  );

  const displayedClients = isExpandedClients ? filteredClients : filteredClients?.slice(0, 12);
  const displayedTechs = isExpandedTechs ? filteredTechs : filteredTechs?.slice(0, 12);

  const handleClientClick = (clientName) => {
    if (highlightedClient === clientName) {
      onClientHighlight(null);
    } else {
      onClientHighlight(clientName);
    }
  };

  const handleTechClick = (techName) => {
    if (highlightedTech === techName) {
      onTechHighlight(null);
    } else {
      onTechHighlight(techName);
    }
  };

  const getItemColor = (item, isHighlighted) => {
     if (isHighlighted) {
      return 'bg-primary text-primary-foreground';
    }
    return 'bg-muted text-muted-foreground hover:bg-muted/80';
  };

  return (
    <motion.div
      className="bg-card border border-border rounded-xl p-6 sticky top-24"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Icon name="Filter" size={20} className="text-primary" />
          {content?.[language]?.title}
        </h3>
      </div>

      {/* Clients Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-muted-foreground mb-2">
          {content?.[language]?.clients}
        </h4>
        <Input
          type="search"
          placeholder={content?.[language]?.searchPlaceholder}
          value={searchTermClients}
          onChange={(e) => setSearchTermClients(e?.target?.value)}
          className="w-full mb-4"
        />
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {displayedClients?.map((item, index) => (
              <motion.button
                key={item?.name}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${getItemColor(item, highlightedClient === item?.name)}`}
                onClick={() => handleClientClick(item?.name)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{item?.name}</div>
                    <div className="text-xs opacity-75">
                      {item?.count} {content?.[language]?.projects}
                    </div>
                  </div>
                  <Icon name="ChevronRight" size={14} />
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
        {filteredClients?.length > 12 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpandedClients(!isExpandedClients)}
            iconName={isExpandedClients ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            fullWidth
          >
            {isExpandedClients ? content?.[language]?.showLess : content?.[language]?.showAll}
          </Button>
        )}
      </div>

      {/* Technologies Filter */}
      <div>
        <h4 className="text-sm font-bold text-muted-foreground mb-2">
          {content?.[language]?.technologies}
        </h4>
        <Input
          type="search"
          placeholder={content?.[language]?.searchPlaceholder}
          value={searchTermTechs}
          onChange={(e) => setSearchTermTechs(e?.target?.value)}
          className="w-full mb-4"
        />
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {displayedTechs?.map((item, index) => (
              <motion.button
                key={item?.name}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${getItemColor(item, highlightedTech === item?.name)}`}
                onClick={() => handleTechClick(item?.name)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{item?.name}</div>
                    <div className="text-xs opacity-75">
                      {item?.yearsExperience} {content?.[language]?.yearsExp} • {item?.count} {content?.[language]?.projects}
                    </div>
                  </div>
                  <Icon name="ChevronRight" size={14} />
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
        {filteredTechs?.length > 12 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpandedTechs(!isExpandedTechs)}
            iconName={isExpandedTechs ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            fullWidth
          >
            {isExpandedTechs ? content?.[language]?.showLess : content?.[language]?.showAll}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default TechnologyFilter;