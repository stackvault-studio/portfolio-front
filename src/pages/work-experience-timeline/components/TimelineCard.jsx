import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const TimelineCard = ({
  experience,
  index,
  isLeft,
  onExpand,
  highlightedTech = null,
  highlightedClient = null, // New prop for highlighted clients
  language = 'en'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [preloadedLogos, setPreloadedLogos] = useState({}); // Store preloaded logos
  const [preloadedClientsLogos, setPreloadedClientsLogos] = useState({});

  const cardVariants = {
    hidden: {
      opacity: 0,
      x: isLeft ? -100 : 100,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.2,
        ease: "easeOut"
      }
    }
  };

  const content = {
    en: {
      present: 'Present',
      viewDetails: 'View Details',
      keyTechnologies: 'Key Technologies',
      keyProjects: 'Key projects',
      teamSize: 'Team Size',
      methodology: 'Methodology',
      year: 'Year',
      years: 'Years',
      month: 'Month',
      months: 'Months'
    },
    fr: {
      present: 'Présent',
      viewDetails: 'Voir Détails',
      keyTechnologies: 'Technologies Clés',
      keyProjects: 'Projets Clés',
      teamSize: 'Taille Équipe',
      methodology: 'Méthodologie',
      year: 'An',
      years: 'Ans',
      month: 'Mois',
      months: 'Mois'
    }
  };

  const preloadLogos = (technologies) => {
    const loadedLogos = {};


    for (const tech of technologies) {
      const base = tech.replace(/\s+/g, '').toLowerCase();

      
      const path = `/assets/images/technologies/${base}.png`;
        
      loadedLogos[tech] = path;
          
        
      }


    setPreloadedLogos(loadedLogos);
  };

  const clientsLogos = (clients) => {
    const loadedLogos = {};


    for (const tech of clients) {
      const base = tech.replace(/\s+/g, '').toLowerCase();

      
      const path = `/assets/images/clients/${base}.png`;
        
      loadedLogos[tech] = path;
          
        
      }


    setPreloadedClientsLogos(loadedLogos);
  };

  useEffect(() => {
    if (experience?.technologies) {
      preloadLogos(experience.technologies);
    }
  }, [experience?.technologies]);

  useEffect(() => {
    if (experience?.clients) {
      clientsLogos(experience.clients);
    }
  }, [experience?.clients]);

  const formatDate = (startDate, endDate) => {
    if (!startDate) return content?.[language]?.present;
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const durationInMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

    const years = Math.floor(durationInMonths / 12);
    const months = durationInMonths % 12;

    const yearLabel = years > 1 ? content[language].years : content[language].year;
    const monthLabel = months > 1 ? content[language].months : content[language].month;

    return years > 0 ? `${years} ${yearLabel} ${months} ${monthLabel}` : `${months} ${monthLabel}`;
  };

  const isClientHighlighted = highlightedClient &&
    experience?.clients?.some(client =>
      client?.toLowerCase()?.includes(highlightedClient?.toLowerCase())
    );

  const isHighlighted = highlightedTech || isClientHighlighted;

  const getTechImage = (tech) => {
    return preloadedLogos[tech] || '/assets/images/technologies/default.svg';
  };

  const getClientImage = (client) => {
    return preloadedClientsLogos[client] || '/assets/images/clients/default.svg';
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={`relative pr-8`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Experience Card */}
      <motion.div
        className={`bg-gradient-to-br from-card via-card to-card/95 border-2 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col relative overflow-hidden ${isHighlighted ? 'ring-2 ring-accent border-accent shadow-accent/20' : 'border-border hover:border-primary/30'
          }`}
        style={{
          minHeight: '300px', // Minimum height for flexibility
          maxHeight: 'auto'   // Allow height to adjust dynamically
        }}
        whileHover={{ scale: 1.02, y: -4 }}
        onClick={() => onExpand(experience)}
      >
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/10 to-transparent rounded-tr-full" />

        {/* First Row - Company Header (Centered) */}
        <div className="flex items-center justify-center gap-4 mb-6 pb-4 border-b-2 border-gradient-to-r from-transparent via-border to-transparent relative z-10">
          <motion.div
            className="w-14 h-14 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center overflow-hidden shadow-md ring-2 ring-background"
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src={experience?.companyLogo}
              alt={`${experience?.company} logo`}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="text-center">
            <p className="text-primary font-bold text-base tracking-wide flex items-center justify-center gap-2">
              <Icon name="Building2" size={16} className="text-primary" />
              {experience?.company}
            </p>
            <h3 className="text-lg font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              {experience?.position?.[language]}
            </h3>
            <div className="flex justify-center gap-2 mt-2">
              <span className="inline-flex items-center rounded-full text-xs font-semibold bg-gradient-to-r from-primary/20 to-primary/10 text-primary px-3 py-1 shadow-sm border border-primary/20">
                <Icon name="Calendar" size={12} className="mr-1.5" />
                {experience?.startDate} - {experience?.endDate || content?.[language]?.present}
              </span>

              <span className="inline-flex items-center rounded-full text-xs font-semibold bg-gradient-to-r from-primary/20 to-primary/10 text-primary px-3 py-1 shadow-sm border border-primary/20">
                <Icon name="Clock" size={12} className="mr-1.5" />
                {formatDate(experience?.startDate, experience?.endDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Second Row - Two Column Grid Layout */}
        <div className="grid grid-cols-2 gap-6 flex-1 overflow-auto relative z-10">
          {/* Main Column - Description & Projects */}
          <div className="order-1 text-center space-y-5 flex flex-col">
            {/* Description */}
            {experience?.description && experience?.description?.[language] && (
              <div className="bg-muted/40 rounded-lg p-4 border border-border/50">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Icon name="FileText" size={14} className="text-primary" />
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Description</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {experience?.description?.[language]}
                </p>
              </div>
            )}

            {/* Key Projects (Clients) */}
            <div className="bg-gradient-to-br from-secondary/5 to-transparent rounded-lg p-4 border border-secondary/20 flex-1">
              <h4 className="text-xs font-bold text-secondary mb-3 flex items-center justify-center gap-2 uppercase tracking-wider">
                <Icon name="Briefcase" size={14} className="text-secondary" />
                {content?.[language]?.keyProjects}
              </h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {experience?.clients?.map((client, clientIndex) => (
                  <motion.div
                    key={clientIndex}
                    className="flex items-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: clientIndex * 0.1 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 shadow-sm ${highlightedClient && client?.toLowerCase()?.includes(highlightedClient?.toLowerCase())
                        ? 'bg-primary text-primary-foreground shadow-primary/30 ring-2 ring-primary/50'
                        : 'bg-info/10 text-info hover:bg-info/20 hover:shadow-md border border-info/20'
                      }`}>
                      <div className="w-5 h-5 rounded-full bg-background/80 flex items-center justify-center p-0.5">
                        <Image
                          src={`${getClientImage(client)}`}
                          alt={`${client} logo`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span>{client}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* View Details Button */}
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                size="sm"
                iconName="ArrowRight"
                iconPosition="right"
                className="group hover:bg-primary hover:text-primary-foreground border-2 border-primary/30 hover:border-primary font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                <span className="flex items-center gap-2">
                  <Icon name="Eye" size={14} />
                  {content?.[language]?.viewDetails}
                </span>
              </Button>
            </div>
          </div>

          {/* Secondary Column - Technologies */}
          <div className="order-2 text-center">
            {/* Key Technologies */}
            <div className="bg-gradient-to-br from-accent/5 to-transparent rounded-lg p-4 border border-accent/20 h-full">
              <h4 className="text-xs font-bold text-accent mb-4 flex items-center justify-center gap-2 uppercase tracking-wider">
                <Icon name="Code2" size={14} className="text-accent" />
                {content?.[language]?.keyTechnologies}
              </h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {experience?.technologies?.map((tech, techIndex) => (
                  <motion.div
                    key={techIndex}
                    className="flex items-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: techIndex * 0.1 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 shadow-sm ${highlightedTech && tech?.toLowerCase()?.includes(highlightedTech?.toLowerCase())
                        ? 'bg-accent text-accent-foreground shadow-accent/30 ring-2 ring-accent/50'
                        : 'bg-info/10 text-info hover:bg-info/20 hover:shadow-md border border-info/20'
                      }`}>
                      <div className="w-5 h-5 rounded-full bg-background/80 flex items-center justify-center p-0.5">
                        <Image
                          src={`${getTechImage(tech)}`}
                          alt={`${tech} logo`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span>{tech}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hover Effect Indicator */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-2xl opacity-0 pointer-events-none"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-2xl opacity-0 pointer-events-none"
          animate={{
            opacity: isHovered ? 1 : 0,
            x: isHovered ? ['-100%', '100%'] : '-100%'
          }}
          transition={{
            opacity: { duration: 0.3 },
            x: { duration: 0.8, ease: "easeInOut" }
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default TimelineCard;