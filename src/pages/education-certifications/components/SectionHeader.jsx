import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const SectionHeader = ({ language }) => {
  const headerContent = {
    en: {
      title: "Education & Certifications",
      subtitle: "Academic Foundation & Professional Credentials",
      description: "A comprehensive overview of my educational journey and professional certifications that validate my expertise in backend development, cloud technologies, and project management."
    },
    fr: {
      title: "Éducation & Certifications",
      subtitle: "Base Académique & Références Professionnelles",
      description: "Un aperçu complet de mon parcours éducatif et de mes certifications professionnelles qui valident mon expertise en développement backend, technologies cloud et gestion de projet."
    }
  };

  const stats = [
    {
      icon: "GraduationCap",
      value: "3",
      label: { en: "Degrees", fr: "Diplômes" },
      color: "primary"
    },
    {
      icon: "Award",
      value: "6",
      label: { en: "Certifications", fr: "Certifications" },
      color: "secondary"
    },
    {
      icon: "Calendar",
      value: "7+",
      label: { en: "Years Learning", fr: "Années d\'Apprentissage" },
      color: "accent"
    },
    {
      icon: "TrendingUp",
      value: "85%",
      label: { en: "Avg. Score", fr: "Score Moyen" },
      color: "warning"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const getColorClass = (color, type = 'bg') => {
    const colorMap = {
      primary: type === 'bg' ? 'bg-primary' : 'text-primary',
      secondary: type === 'bg' ? 'bg-secondary' : 'text-secondary',
      accent: type === 'bg' ? 'bg-accent' : 'text-accent',
      warning: type === 'bg' ? 'bg-warning' : 'text-warning'
    };
    return colorMap?.[color] || colorMap?.primary;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-center mb-16"
    >
      {/* Main Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
            <Icon name="BookOpen" size={24} className="text-primary" />
          </div>
          <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
            <Icon name="Award" size={24} className="text-secondary" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          {headerContent?.[language]?.title}
        </h1>
        
        <h2 className="text-xl md:text-2xl text-muted-foreground mb-6">
          {headerContent?.[language]?.subtitle}
        </h2>
        
        <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          {headerContent?.[language]?.description}
        </p>
      </motion.div>
      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
      >
        {stats?.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300"
          >
            <div className={`w-12 h-12 ${getColorClass(stat?.color)}/10 rounded-full flex items-center justify-center mx-auto mb-3`}>
              <Icon name={stat?.icon} size={24} className={getColorClass(stat?.color, 'text')} />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {stat?.value}
            </div>
            <div className="text-sm text-muted-foreground">
              {stat?.label?.[language]}
            </div>
          </motion.div>
        ))}
      </motion.div>
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute top-20 right-1/4 w-24 h-24 bg-secondary/5 rounded-full blur-2xl -z-10" />
    </motion.div>
  );
};

export default SectionHeader;