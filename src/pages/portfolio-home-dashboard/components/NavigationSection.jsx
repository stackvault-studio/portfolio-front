import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NavigationSection = ({ apiStats, language }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const content = {
    en: {
      title: "Explore My Portfolio",
      subtitle: "Discover my professional journey and expertise",
      sections: [
        {
          id: 'work-experience-timeline',
          title: 'Work Experience',
          description: 'Detailed timeline of my '+ apiStats?.yearsExperience +'+ years in backend development',
          icon: 'Briefcase',
          color: 'primary',
          stats: apiStats?.yearsExperience + '+ Years'
        },
        {
          id: 'education-certifications',
          title: 'Education & Certifications',
          description: 'Academic background and professional certifications',
          icon: 'GraduationCap',
          color: 'secondary',
          stats: apiStats?.totalCertifications +' Certs'
        },
        {
          id: 'technologies-showcase',
          title: 'Technologies',
          description: 'Comprehensive overview of my technical stack',
          icon: 'Code',
          color: 'accent',
          stats: apiStats?.totalTechnologies +'+ Tech'
        },
        {
          id: 'mission-rate-calculator',
          title: 'Mission Rate Evaluator',
          description: 'AI-powered tool to evaluate project rates',
          icon: 'Calculator',
          color: 'warning',
          stats: 'AI Powered'
        }
      ]
    },
    fr: {
      title: "Explorez Mon Portfolio",
      subtitle: "Découvrez mon parcours professionnel et mon expertise",
      sections: [
        {
          id: 'work-experience-timeline',
          title: 'Expérience Professionnelle',
          description: 'Chronologie détaillée de mes '+ apiStats?.yearsExperience +'+ années en développement backend',
          icon: 'Briefcase',
          color: 'primary',
          stats: apiStats?.yearsExperience + '+ Années'
        },
        {
          id: 'education-certifications',
          title: 'Formation & Certifications',
          description: 'Formation académique et certifications professionnelles',
          icon: 'GraduationCap',
          color: 'secondary',
          stats: apiStats?.totalCertifications +' Certs'
        },
        {
          id: 'technologies-showcase',
          title: 'Technologies',
          description: 'Vue d\'ensemble complète de ma stack technique',
          icon: 'Code',
          color: 'accent',
          stats: apiStats?.totalTechnologies +'+ Tech'
        },
        {
          id: 'mission-rate-calculator',
          title: 'Évaluateur de correspondance',
          description: 'Outil alimenté par IA pour évaluer la correspondance du projet',
          icon: 'Calculator',
          color: 'warning',
          stats: 'IA Intégrée'
        }
      ]
    }
  };

  const currentContent = content?.[language] || content?.en;

  const handleNavigate = (sectionId) => {
    window.location.href = `/${sectionId}`;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            {currentContent?.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {currentContent?.subtitle}
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentContent?.sections?.map((section, index) => (
            <div
              key={section?.id}
              className={`group cursor-pointer transition-all duration-500 hover:scale-105 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onClick={() => handleNavigate(section?.id)}
            >
              <div className="bg-card border border-border rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 hover:border-primary/30">
                {/* Icon & Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 bg-${section?.color}/10 rounded-xl flex items-center justify-center group-hover:bg-${section?.color}/20 transition-colors`}>
                    <Icon name={section?.icon} size={28} className={`text-${section?.color}`} />
                  </div>
                  <div className={`px-3 py-1 bg-${section?.color}/10 rounded-full`}>
                    <span className={`text-xs font-medium text-${section?.color}`}>
                      {section?.stats}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {section?.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {section?.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center space-x-2 text-muted-foreground group-hover:text-primary transition-colors">
                    <span className="text-sm font-medium">
                      {language === 'fr' ? 'Explorer' : 'Explore'}
                    </span>
                    <Icon name="ArrowRight" size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Indicator */}
        
      </div>
    </section>
  );
};

export default NavigationSection;