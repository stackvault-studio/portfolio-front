import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const SkillsProgressionMap = ({ language }) => {
  const [activeSkill, setActiveSkill] = useState(null);
  const [visibleConnections, setVisibleConnections] = useState(new Set());

  const skillsProgression = [
    {
      id: 1,
      category: {
        en: "Programming Languages",
        fr: "Langages de Programmation"
      },
      icon: "Code2",
      color: "primary",
      education: {
        en: "Learned fundamentals in university courses",
        fr: "Appris les fondamentaux dans les cours universitaires"
      },
      certifications: {
        en: "Oracle Java SE Professional certification",
        fr: "Certification Oracle Java SE Professionnel"
      },
      skills: ["Java", "Python", "JavaScript", "C++"],
      level: 95,
      position: { x: 20, y: 20 }
    },
    {
      id: 2,
      category: {
        en: "Cloud Platforms",
        fr: "Plateformes Cloud"
      },
      icon: "Cloud",
      color: "secondary",
      education: {
        en: "Self-taught through online courses and projects",
        fr: "Auto-apprentissage via cours en ligne et projets"
      },
      certifications: {
        en: "AWS Solutions Architect & Azure Developer certifications",
        fr: "Certifications AWS Solutions Architect & Azure Developer"
      },
      skills: ["AWS", "Azure", "Google Cloud", "Docker"],
      level: 88,
      position: { x: 70, y: 30 }
    },
    {
      id: 3,
      category: {
        en: "Database Systems",
        fr: "Systèmes de Base de Données"
      },
      icon: "Database",
      color: "accent",
      education: {
        en: "Advanced database design in Master\'s program",
        fr: "Conception avancée de bases de données en Master"
      },
      certifications: {
        en: "Oracle Database certification (in progress)",
        fr: "Certification Oracle Database (en cours)"
      },
      skills: ["PostgreSQL", "MongoDB", "Redis", "Oracle"],
      level: 85,
      position: { x: 30, y: 70 }
    },
    {
      id: 4,
      category: {
        en: "DevOps & Orchestration",
        fr: "DevOps & Orchestration"
      },
      icon: "Settings",
      color: "warning",
      education: {
        en: "Practical experience through internships",
        fr: "Expérience pratique via stages"
      },
      certifications: {
        en: "Certified Kubernetes Administrator (CKA)",
        fr: "Administrateur Kubernetes Certifié (CKA)"
      },
      skills: ["Kubernetes", "Jenkins", "GitLab CI", "Terraform"],
      level: 80,
      position: { x: 75, y: 75 }
    },
    {
      id: 5,
      category: {
        en: "Project Management",
        fr: "Gestion de Projet"
      },
      icon: "Users",
      color: "error",
      education: {
        en: "Leadership courses and team projects",
        fr: "Cours de leadership et projets d\'équipe"
      },
      certifications: {
        en: "Project Management Professional (PMP)",
        fr: "Professionnel en Gestion de Projet (PMP)"
      },
      skills: ["Agile", "Scrum", "Risk Management", "Team Leadership"],
      level: 75,
      position: { x: 50, y: 50 }
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleConnections(prev => {
        const newSet = new Set(prev);
        const nextIndex = newSet?.size;
        if (nextIndex < skillsProgression?.length - 1) {
          newSet?.add(nextIndex);
        }
        return newSet;
      });
    }, 800);

    return () => clearInterval(timer);
  }, []);

  const getColorClass = (color, type = 'bg') => {
    const colorMap = {
      primary: type === 'bg' ? 'bg-primary' : 'text-primary',
      secondary: type === 'bg' ? 'bg-secondary' : 'text-secondary',
      accent: type === 'bg' ? 'bg-accent' : 'text-accent',
      warning: type === 'bg' ? 'bg-warning' : 'text-warning',
      error: type === 'bg' ? 'bg-error' : 'text-error'
    };
    return colorMap?.[color] || colorMap?.primary;
  };

  return (
    <div className="relative bg-card border border-border rounded-xl p-8 min-h-[500px] overflow-hidden">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          {language === 'en' ? 'Skills Progression Map' : 'Carte de Progression des Compétences'}
        </h3>
        <p className="text-muted-foreground">
          {language === 'en' ?'How education and certifications shaped my expertise' :'Comment l\'éducation et les certifications ont façonné mon expertise'
          }
        </p>
      </div>
      {/* Skills Map */}
      <div className="relative h-96">
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {skillsProgression?.map((skill, index) => {
            if (index === skillsProgression?.length - 1) return null;
            const nextSkill = skillsProgression?.[index + 1];
            const isVisible = visibleConnections?.has(index);
            
            return (
              <motion.line
                key={`connection-${skill?.id}`}
                x1={`${skill?.position?.x}%`}
                y1={`${skill?.position?.y}%`}
                x2={`${nextSkill?.position?.x}%`}
                y2={`${nextSkill?.position?.y}%`}
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="text-border"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isVisible ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            );
          })}
        </svg>

        {/* Skill Nodes */}
        {skillsProgression?.map((skill, index) => (
          <motion.div
            key={skill?.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{ 
              left: `${skill?.position?.x}%`, 
              top: `${skill?.position?.y}%`,
              zIndex: 10
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.3, duration: 0.5 }}
            onMouseEnter={() => setActiveSkill(skill?.id)}
            onMouseLeave={() => setActiveSkill(null)}
          >
            {/* Skill Circle */}
            <div className={`relative w-16 h-16 ${getColorClass(skill?.color)} rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110`}>
              <Icon name={skill?.icon} size={24} color="white" />
              
              {/* Progress Ring */}
              <svg className="absolute inset-0 w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="2"
                />
                <motion.circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - skill?.level / 100) }}
                  transition={{ delay: index * 0.3 + 0.5, duration: 1 }}
                />
              </svg>
              
              {/* Level Badge */}
              <div className="absolute -bottom-2 -right-2 bg-background border-2 border-current rounded-full w-8 h-8 flex items-center justify-center">
                <span className={`text-xs font-bold ${getColorClass(skill?.color, 'text')}`}>
                  {skill?.level}%
                </span>
              </div>
            </div>

            {/* Skill Label */}
            <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-center">
              <div className="text-sm font-medium text-foreground whitespace-nowrap">
                {skill?.category?.[language]}
              </div>
            </div>

            {/* Tooltip */}
            {activeSkill === skill?.id && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 bg-popover border border-border rounded-lg p-4 shadow-lg w-80 z-20"
              >
                <h4 className="font-semibold text-foreground mb-2">
                  {skill?.category?.[language]}
                </h4>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="flex items-center text-muted-foreground mb-1">
                      <Icon name="GraduationCap" size={14} className="mr-1" />
                      {language === 'en' ? 'Education:' : 'Éducation:'}
                    </div>
                    <p className="text-foreground">{skill?.education?.[language]}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-muted-foreground mb-1">
                      <Icon name="Award" size={14} className="mr-1" />
                      {language === 'en' ? 'Certifications:' : 'Certifications:'}
                    </div>
                    <p className="text-foreground">{skill?.certifications?.[language]}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <Icon name="Zap" size={14} className="mr-1" />
                      {language === 'en' ? 'Key Skills:' : 'Compétences Clés:'}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {skill?.skills?.map((skillName, idx) => (
                        <span
                          key={idx}
                          className={`text-xs px-2 py-1 rounded ${getColorClass(skill?.color)}/10 ${getColorClass(skill?.color, 'text')} border border-current/20`}
                        >
                          {skillName}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
      {/* Legend */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="GraduationCap" size={16} className="text-primary" />
            <span className="text-muted-foreground">
              {language === 'en' ? 'Education Foundation' : 'Base Éducative'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Award" size={16} className="text-secondary" />
            <span className="text-muted-foreground">
              {language === 'en' ? 'Professional Certification' : 'Certification Professionnelle'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={16} className="text-accent" />
            <span className="text-muted-foreground">
              {language === 'en' ? 'Skill Progression' : 'Progression des Compétences'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsProgressionMap;