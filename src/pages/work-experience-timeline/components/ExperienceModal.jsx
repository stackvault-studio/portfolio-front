import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { getExperienceById } from '../../../services/experienceService';

const ExperienceModal = ({ 
  experience, 
  isOpen, 
  onClose, 
  language = 'en' 
}) => {
  // Helper to return language-specific text or fallback to plain string
  const localize = (field) => {
    if (field == null) return '';
    if (Array.isArray(field)) return field;
    return typeof field === 'object' ? (field[language] || field.en || '') : field;
  };

  const content = {
    en: {
      close: 'Close',
      duration: 'Duration',
      present: 'Present',
      description: 'Description',
      responsibilities: 'Key Responsibilities',
      achievements: 'Key Achievements',
      technologies: 'Technologies Used',
      projects: 'Projects',
      teamSize: 'Team Size',
      location: 'Location',
      methodology: 'Methodology',
      year: 'Year',
      years: 'Years',
      month: 'Month',
      months: 'Months',
      clients: 'Clients'
    },
    fr: {
      close: 'Fermer',
      duration: 'Durée',
      present: 'Présent',
      description: 'Description',
      responsibilities: 'Responsabilités Clés',
      achievements: 'Réalisations Clés',
      technologies: 'Technologies Utilisées',
      projects: 'Projets',
      teamSize: 'Taille Équipe',
      location: 'Localisation',
      methodology: 'Méthodologie',
      year: 'An',
      years: 'Ans',
      month: 'Mois',
      months: 'Mois',
      clients: 'Clients'
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return content?.[language]?.present;
    const date = new Date(dateStr);
    return language === 'fr' ? date?.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
      : date?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate) return '';
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const durationInMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    
    const years = Math.floor(durationInMonths / 12);
    const months = durationInMonths % 12;

    const yearLabel = years > 1 ? content[language].years : content[language].year;
    const monthLabel = months > 1 ? content[language].months : content[language].month;

    return years > 0 ? `${years} ${yearLabel} ${months} ${monthLabel}` : `${months} ${monthLabel}`;
  };

  const [fullExperience, setFullExperience] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && experience?.id) {
      setLoading(true);
      getExperienceById(experience.id)
        .then(data => setFullExperience(data))
        .catch(() => setFullExperience(null))
        .finally(() => setLoading(false));
    } else {
      setFullExperience(null);
    }
  }, [isOpen, experience?.id]);

  const expData = fullExperience || experience;

  const companyLocation = expData
    ? (localize(expData.location?.city) && localize(expData.location?.country))
      ? `${localize(expData.location?.city)} - ${localize(expData.location?.country)}`
      : (typeof localize(expData.location) === 'string'
         ? localize(expData.location).split(/,|-/).map(s => s.trim()).slice(0, 2).join(' - ')
         : '')
    : '';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e?.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!experience) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-card border border-border rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e?.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center overflow-hidden">
                    <Image
                      src={expData?.companyLogo}
                      alt={`${expData?.companyName || expData?.company} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {localize(expData?.position)}
                    </h2>
                    <p className="text-lg text-primary font-semibold">
                      {localize(expData?.companyName || expData?.company)}
                      {companyLocation && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          {companyLocation}
                        </span>
                      )}
                    </p>
                    <p className="text-muted-foreground">
                      {formatDate(expData?.startDate)} - {formatDate(expData?.endDate)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  iconName="X"
                  className="hover:bg-destructive/10 hover:text-destructive"
                />
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Icon name="Loader2" size={32} className="animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Projects List */}
                    {Array.isArray(expData?.projects) && expData?.projects.length > 0 && (
                      <div className="space-y-6">
                        {expData.projects
                          .slice() // Create a shallow copy to avoid mutating the original array
                          .sort((a, b) => new Date(b.startDate) - new Date(a.startDate)) // Sort by startDate descending
                          .map((project, idx) => (
                            <motion.div
                              key={project.id || idx}
                              className="bg-muted/30 rounded-xl border border-border overflow-hidden"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                            >
                              {/* Project Header */}
                              <div className="bg-primary/5 p-4 border-b border-border flex items-center gap-4">
                                {/* Start and End Dates */}
                                <div className="flex flex-col items-center justify-center text-sm text-muted-foreground">
                                  <span>{formatDate(project.startDate)}</span>
                                  <span className="text-xs">-</span>
                                  <span>{project.endDate ? formatDate(project.endDate) : content?.[language]?.present}</span>
                                </div>

                                {/* Project Name and Logo */}
                                {project.projectName && (
                                  <div className="flex items-center gap-4">
                                    
                                    <div>
                                      <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                                        {project.projectName}
                                      </h3>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Project Content - Two Columns */}
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                  {/* Description */}
                                  {project.projectDescription && (
                                    <div>
                                      <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                                        <Icon name="FileText" size={16} className="text-primary" />
                                        {content?.[language]?.description}
                                      </h4>
                                      <p className="text-sm text-foreground leading-relaxed">
                                        {localize(project.projectDescription)}
                                      </p>
                                    </div>
                                  )}

                                  {/* Key Responsibilities */}
                                  {project.responsibilities && project.responsibilities.length > 0 && (
                                    <div>
                                      <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                                        <Icon name="CheckCircle" size={16} className="text-secondary" />
                                        {content?.[language]?.responsibilities}
                                      </h4>
                                      <ul className="space-y-2">
                                        {project.responsibilities.map((resp, rIdx) => (
                                          <li key={resp.id || rIdx} className="flex items-start gap-2 text-sm text-foreground">
                                            <Icon name="ChevronRight" size={14} className="text-secondary mt-0.5 flex-shrink-0" />
                                            <span>{localize(resp.description || resp)}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Clients */}
                                  
                                 {/* {project.clients && project.clients.length > 0 && (
                                    <div>
                                      <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                                        <Icon name="Briefcase" size={16} className="text-primary" />
                                        {content?.[language]?.clients || 'Clients'}
                                      </h4>
                                      <ul className="space-y-2">
                                        {project.clients.map((client, cIdx) => (
                                          <li key={client.id || cIdx} className="flex items-center gap-4 text-sm text-foreground">
                                            {client.logo ? (
                                              <div className="w-8 h-8 bg-muted rounded-full overflow-hidden flex-shrink-0">
                                                <Image
                                                  src={client.logo}
                                                  alt={`${client.name || 'Client'} logo`}
                                                  className="w-full h-full object-cover"
                                                />
                                              </div>
                                            ) : (
                                              <Icon name="User" size={14} className="text-primary flex-shrink-0" />
                                            )}
                                            <span>{localize(client.name || client)}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}*/}
                                </div>     
                                  
                                {/* Right Column */}
                                <div className="space-y-4">
                                  {/* Key Achievements */}
                                  {project.achievements && project.achievements.length > 0 && (
                                    <div>
                                      <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                                        <Icon name="Trophy" size={16} className="text-warning" />
                                        {content?.[language]?.achievements}
                                      </h4>
                                      <ul className="space-y-2">
                                        {project.achievements.map((achievement, aIdx) => (
                                          <li key={achievement.id || aIdx} className="flex items-start gap-2 text-sm text-foreground">
                                            <Icon name="Star" size={14} className="text-warning mt-0.5 flex-shrink-0" />
                                            <span>{localize(achievement.description || achievement)}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Duration */}
                                  {(project.startDate || project.duration) && (
                                    <div>
                                      <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                                        <Icon name="Clock" size={16} className="text-primary" />
                                        {content?.[language]?.duration}
                                      </h4>
                                      <p className="text-sm text-foreground">
                                        {project.duration || calculateDuration(project.startDate, project.endDate)}
                                      </p>
                                    </div>
                                  )}

                                  {/* Technologies Used */}
                                  {project.technologies && project.technologies.length > 0 && (
                                    <div>
                                      <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                                        <Icon name="Code" size={16} className="text-accent" />
                                        {content?.[language]?.technologies}
                                      </h4>
                                      <div className="flex flex-wrap gap-2">
                                        {Object.entries(
                                          project.technologies.reduce((acc, tech) => {
                                            const techName = tech.name || tech; // Use the name or the raw string
                                            const description = localize(tech.description) || ''; // Localize the description
                                            if (!acc[techName]) {
                                              acc[techName] = [];
                                            }
                                            acc[techName].push(description);
                                            return acc;
                                          }, {})
                                        ).map(([techName, descriptions], tIdx) => (
                                          <div
                                            key={tIdx}
                                            className="relative group flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium"
                                          >
                                            <Image
                                              src={`/assets/logos/${techName}.png`}
                                              alt={`${techName} logo`}
                                              className="w-4 h-4"
                                            />
                                            <span>{techName}</span>
                                            {/* Tooltip for descriptions */}
                                            {descriptions.length > 0 && (
                                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-card text-card-foreground text-xs rounded-lg shadow-lg p-2 whitespace-pre-line z-50">
                                                {descriptions.join('\n')}
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Team Size */}
                                  {project.teamSize && (
                                    <div>
                                      <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                                        <Icon name="Users" size={16} className="text-secondary" />
                                        {content?.[language]?.teamSize}
                                      </h4>
                                      <p className="text-sm text-foreground">{project.teamSize}</p>
                                    </div>
                                  )}

                                  {/* Methodology */}
                                  {project.methodology && (
                                    <div>
                                      <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                                        <Icon name="Activity" size={16} className="text-primary" />
                                        {content?.[language]?.methodology}
                                      </h4>
                                      <p className="text-sm text-foreground">{project.methodology}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExperienceModal;