import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const EducationTimeline = ({ language, educationData = [] }) => {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const timelineRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleItems(prev => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.3, rootMargin: '-50px' }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    // ✅ Immediately mark items already in view as visible
    itemRefs.current.forEach((ref, index) => {
      if (ref && ref.getBoundingClientRect().top < window.innerHeight) {
        setVisibleItems(prev => new Set([...prev, index]));
      }
    });

    return () => observer.disconnect();
  }, [educationData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: -50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Show fallback if no data
  if (!educationData || educationData.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Icon name="AlertCircle" size={32} className="mx-auto mb-4 opacity-50" />
        <p>{language === 'en' ? 'No education data available' : 'Aucune donnée éducative disponible'}</p>
      </div>
    );
  }

return (
  <div className="relative">
    <motion.div
      ref={timelineRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-16"
    >
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent opacity-30" />

      {educationData?.map((education, index) => (
        <motion.div
          key={education?.id}
          ref={el => itemRefs.current[index] = el}
          data-index={index}
          variants={itemVariants}
          className="relative pl-20"
        >
          {/* Timeline Dot */}
          <motion.div
            initial={{ scale: 0 }}
            animate={visibleItems?.has(index) ? { scale: 1 } : { scale: 0 }}
            transition={{ delay: index * 0.2, duration: 0.4 }}
            className="absolute left-6 top-6 w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg z-10"
          />

          {/* Education Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={visibleItems?.has(index) ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: index * 0.2 + 0.2, duration: 0.5 }}
            className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30"
          >
            <div className="flex flex-col gap-6">
              {/* Institution Image */}
              <div className="flex-shrink-0">
                <div className="w-full lg:w-32 h-24 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={education?.image}
                    alt={education?.institution}
                    className="w-full h-full object-cover"
                  />
                </div>
                
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-1">
                  {education?.degree?.[language]}
                </h3>
              {/* Education Details under the image */}
              <div className="space-y-4">
                

                <div className="flex flex-wrap items-center text-muted-foreground text-sm gap-x-6 gap-y-2">
                  <div className="flex items-center space-x-1">
                    <Icon name="Building2" size={14} />
                    <span>{education?.institution}</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Icon name="MapPin" size={14} />
                    <span>{education?.location?.[language] || education?.location}</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Icon name="GraduationCap" size={14} />
                    <span>{education?.graduationYear}</span>
                  </div>
                </div>
              </div>

              {/* Coursework */}
              {education?.coursework?.[language]?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
                    <Icon name="BookOpen" size={16} className="mr-2" />
                    {language === 'en' ? 'Key Coursework' : 'Cours Principaux'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {education?.coursework?.[language]?.map((course, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {education?.projects?.[language]?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
                    <Icon name="Code2" size={16} className="mr-2" />
                    {language === 'en' ? 'Notable Projects' : 'Projets Notables'}
                  </h4>
                  <ul className="space-y-1">
                    {education?.projects?.[language]?.map((project, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start">
                        <Icon name="ChevronRight" size={14} className="mr-1 mt-0.5 flex-shrink-0" />
                        {project}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Achievements */}
              {education?.achievements?.[language]?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
                    <Icon name="Award" size={16} className="mr-2" />
                    {language === 'en' ? 'Achievements' : 'Réalisations'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {education?.achievements?.[language]?.map((achievement, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-md border border-accent/20"
                      >
                        {achievement}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  </div>
);
};

export default EducationTimeline;