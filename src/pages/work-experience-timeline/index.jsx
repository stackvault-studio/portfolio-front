import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import TimelineCard from './components/TimelineCard';
import TechnologyFilter from './components/TechnologyFilter';
import ExperienceModal from './components/ExperienceModal';
import LoadingSkeleton from './components/LoadingSkeleton';
import ScrollProgressIndicator from '../../components/ui/ScrollProgressIndicator';
import Icon from '../../components/AppIcon';
import { getExperiences } from '../../services/experienceService';
import { useLanguage } from '../../contexts/LanguageContext';

const WorkExperienceTimeline = () => {
  const { language } = useLanguage();
  const [highlightedTech, setHighlightedTech] = useState(null);
  const [highlightedClient, setHighlightedClient] = useState(null);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [visibleCards, setVisibleCards] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [stats, setStats] = useState({});
  const timelineRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getExperiences()
      .then(data => {
        const list = Array.isArray(data.data.experiences) ? data.data.experiences : [];
        setExperiences(list);
        setStats(data.data.stats); // Set the stats from the backend response
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  const content = {
    en: {
      title: "Professional Journey",
      subtitle: stats.yearsExperience +"+ Years of Fullstack Development Excellence",
      description: "Explore my professional timeline showcasing expertise in Java, Spring Boot, microservices, and scalable system architecture. Each role has contributed to building robust, high-performance applications.",
      yearsExperience: "Years of Experience",
      companiesWorked: "Companies",
      projectsDelivered: "Projects Delivered",
      technologiesMastered: "Technologies"
    },
    fr: {
      title: "Parcours Professionnel",
      subtitle: stats.yearsExperience +"+ Ans d'Excellence en Développement Backend",
      description: "Explorez ma chronologie professionnelle mettant en valeur l'expertise en Java, Spring Boot, microservices et architecture système évolutive. Chaque rôle a contribué à construire des applications robustes et performantes.",
      yearsExperience: "Années d\'Expérience",
      companiesWorked: "Entreprises",
      projectsDelivered: "Projets Livrés",
      technologiesMastered: "Technologies"
    }
  };

  // Helper function to calculate duration
  const calculateDuration = (startDate, endDate) => {
    if (!startDate) return "Duration not specified";
    
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0 && months > 0) {
      return `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`;
    } else if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      return "Less than 1 month";
    }
  };

  // Intersection Observer for timeline animation
  useEffect(() => {
    if (!timelineRef?.current || experiences?.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleCards(prev => Math.max(prev, index + 1));
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }
    );

    const cards = timelineRef?.current?.querySelectorAll('[data-index]');
    cards?.forEach(card => observer?.observe(card));

    return () => observer?.disconnect();
  }, [experiences]);

  if (loading) {
    return <LoadingSkeleton language={language} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertCircle" size={48} className="text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Error Loading Experience</h2>
          <p className="text-muted-foreground mb-4">{error.message || String(error)}</p>
          <button 
            onClick={() => window.location?.reload()} 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ScrollProgressIndicator />
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {content?.[language]?.title}
            </h1>
            <p className="text-xl text-primary font-semibold mb-6">
              {content?.[language]?.subtitle}
            </p>
            <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {content?.[language]?.description}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">{stats.yearsExperience || 0}+</div>
              <div className="text-sm text-muted-foreground">{content?.[language]?.yearsExperience}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">{experiences?.length || 0}</div>
              <div className="text-sm text-muted-foreground">{content?.[language]?.companiesWorked}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">{stats.totalProjects || 0}+</div>
              <div className="text-sm text-muted-foreground">{content?.[language]?.projectsDelivered}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-warning mb-2">{stats.totalTechnologies || 0}+</div>
              <div className="text-sm text-muted-foreground">{content?.[language]?.technologiesMastered}</div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Timeline Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Timeline */}
            <div className="lg:col-span-3">
              <div className="relative" ref={timelineRef}>            

                {/* Timeline Cards */}
                <div className="relative z-10">
                  {(Array.isArray(experiences) ? experiences : []).map((experience, index) => (
                    <div key={experience?.id} data-index={index} className="mb-12">
                      <TimelineCard
                        experience={experience}
                        index={index}
                        isLeft={index % 2 === 0}
                        onExpand={setSelectedExperience}
                        highlightedTech={highlightedTech}
                        highlightedClient={highlightedClient}
                        language={language}
                        style={{
                          minHeight: '200px', // Minimum height for flexibility
                          maxHeight: 'auto'   // Allow height to adjust dynamically
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Technology Filter Sidebar */}
            <div className="lg:col-span-1">
              <TechnologyFilter
                experiences={experiences}
                onTechHighlight={setHighlightedTech}
                highlightedTech={highlightedTech}
                onClientHighlight={setHighlightedClient}
                highlightedClient={highlightedClient}
                language={language}
              />
            </div>
          </div>
        </div>
      </section>
      {/* Experience Modal */}
      <ExperienceModal
        experience={selectedExperience}
        isOpen={!!selectedExperience}
        onClose={() => setSelectedExperience(null)}
        language={language}
      />
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
              {language === 'fr' ?'Développeur FullStack Senior • Spécialiste Java & BPM' :'Senior FullStack Developer • Java & BPM Specialist'
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

export default WorkExperienceTimeline;