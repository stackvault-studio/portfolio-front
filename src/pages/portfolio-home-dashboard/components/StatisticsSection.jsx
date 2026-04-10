import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';

// Fix: Accept props as a single object, not destructured
const StatisticsSection = ({ apiStats, language }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    experience: 0,
    projects: 0,
    certifications: 0,
    clients: 0
  });
  const sectionRef = useRef(null);

  const content = buildContent();

  function buildContent() {
  return {
    en: {
      title: "Professional Journey",
      subtitle: "Numbers that define my IT development expertise",
      stats: [
        {
          key: 'experience',
          value: apiStats?.yearsExperience || 0,
          suffix: '+',
          label: 'Years Experience',
          description: 'FullStack Development',
          icon: 'Calendar'
        },
        {
          key: 'projects',
          value: apiStats?.totalProjects || 0,
          suffix: '+',
          label: 'Projects Completed',
          description: 'Enterprise Solutions',
          icon: 'FolderCheck'
        },
        {
          key: 'certifications',
          value: apiStats?.totalCertifications || 0,
          suffix: '',
          label: 'Certifications',
          description: 'Technical & Professional',
          icon: 'Award'
        },
        {
          key: 'clients',
          value: apiStats?.totalClients || 0,
          suffix: '+',
          label: 'Happy Clients',
          description: 'Across Industries',
          icon: 'Users'
        }
      ]
    },
    fr: {
      title: "Parcours Professionnel",
      subtitle: "Les chiffres qui définissent mon expertise en développement backend",
      stats: [
        {
          key: 'experience',
          value: apiStats?.yearsExperience || 0,
          suffix: '+',
          label: 'Années d\'Expérience',
          description: 'Développement Backend',
          icon: 'Calendar'
        },
        {
          key: 'projects',
          value: apiStats?.totalProjects || 0,
          suffix: '+',
          label: 'Projets Réalisés',
          description: 'Solutions Entreprise',
          icon: 'FolderCheck'
        },
        {
          key: 'certifications',
          value: apiStats?.totalCertifications || 0,
          suffix: '',
          label: 'Certifications',
          description: 'Techniques & Professionnelles',
          icon: 'Award'
        },
        {
          key: 'clients',
          value: apiStats?.totalClients || 0,
          suffix: '+',
          label: 'Clients Satisfaits',
          description: 'Tous Secteurs',
          icon: 'Users'
        }
      ]
    }
  };
}

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef?.current) {
      observer?.observe(sectionRef?.current);
    }

    return () => observer?.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const currentContent = content?.[language] || content?.en;
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    currentContent?.stats?.forEach((stat, index) => {
      const increment = stat?.value / steps;
      let currentValue = 0;

      const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= stat?.value) {
          currentValue = stat?.value;
          clearInterval(timer);
        }

        setCounters(prev => ({
          ...prev,
          [stat?.key]: Math.floor(currentValue)
        }));
      }, stepDuration);

      // Cleanup function
      setTimeout(() => clearInterval(timer), duration + (index * 200));
    });
  }, [isVisible, language]);

  const currentContent = content?.[language] || content?.en;

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            {currentContent?.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {currentContent?.subtitle}
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentContent?.stats?.map((stat, index) => (
            <div
              key={stat?.key}
              className={`bg-card border border-border rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-500 hover:scale-105 group ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <Icon name={stat?.icon} size={32} className="text-primary" />
              </div>

              {/* Counter */}
              <div className="mb-4">
                <div className="text-4xl font-bold text-foreground mb-2">
                  {counters?.[stat?.key]}{stat?.suffix}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {stat?.label}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {stat?.description}
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="w-full bg-muted/30 rounded-full h-1">
                <div
                  className="h-1 bg-primary rounded-full transition-all duration-2000 ease-out"
                  style={{
                    width: isVisible ? '100%' : '0%',
                    transitionDelay: `${index * 200}ms`
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Achievement Highlights */}
        <div className={`mt-16 grid md:grid-cols-3 gap-6 transition-all duration-1000 animation-delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {[
            {
              icon: 'Trophy',
              title: language === 'fr' ? 'Excellence Technique' : 'Technical Excellence',
              description: language === 'fr' ? 'Solutions robustes et évolutives' : 'Robust and scalable solutions'
            },
            {
              icon: 'Target',
              title: language === 'fr' ? 'Livraison à Temps' : 'On-Time Delivery',
              description: language === 'fr' ? '98% des projets livrés dans les délais' : '98% of projects delivered on time'
            },
            {
              icon: 'Heart',
              title: language === 'fr' ? 'Satisfaction Client' : 'Client Satisfaction',
              description: language === 'fr' ? 'Taux de satisfaction de 96%' : '96% satisfaction rate'
            }
          ]?.map((achievement, index) => (
            <div key={achievement?.title} className="flex items-center space-x-4 p-4 bg-muted/20 rounded-xl">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={achievement?.icon} size={20} className="text-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{achievement?.title}</h4>
                <p className="text-sm text-muted-foreground">{achievement?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;