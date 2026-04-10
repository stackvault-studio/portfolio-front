import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CertificationsTimeline = ({
  language,
  selectedFilter,
  onFilterChange,
  certificationsData = [],
  educationData = [],
}) => {
  // normalize selected filter for case-insensitive matching
  const selectedFilterNorm = (selectedFilter || 'all').toString().toLowerCase();

  // derive cert types (lowercased keys) and provide display label helper
  const certTypes = useMemo(() => {
    if (!Array.isArray(certificationsData) || certificationsData.length === 0) return ['all'];
    const set = new Set();
    certificationsData.forEach((cert) => {
      if (Array.isArray(cert?.categories)) {
        cert.categories.forEach((c) => {
          if (c) set.add(c.toString().toLowerCase());
        });
      }
    });
    return ['all', ...Array.from(set)];
  }, [certificationsData]);

  // filter certifications case-insensitively
  const filteredCertifications = useMemo(() => {
    if (selectedFilterNorm === 'all') return certificationsData || [];
    return (certificationsData || []).filter(
      (cert) =>
        Array.isArray(cert?.categories) &&
        cert.categories.map((c) => c?.toString().toLowerCase()).includes(selectedFilterNorm)
    );
  }, [certificationsData, selectedFilterNorm]);

  // status helper (supports localized object or plain string)
  const getStatusInfo = (cert) => {
    const rawLabel = cert?.status?.[language] || cert?.status || '';
    const label = (rawLabel || '').toString();
    const lc = label.toLowerCase();
    if (lc.includes('active') || lc.includes('actif'))
      return { key: 'active', label: label || (language === 'en' ? 'Active' : 'Actif') };
    if (lc.includes('expir') || lc.includes('expiring'))
      return { key: 'expiring', label: label || (language === 'en' ? 'Expiring' : 'Expiration') };
    return { key: 'expired', label: label || (language === 'en' ? 'Expired' : 'Expiré') };
  };

  // fallback when no data
  if (
    (!certificationsData || certificationsData.length === 0) &&
    (!educationData || educationData.length === 0)
  ) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Icon name="AlertCircle" size={32} className="mx-auto mb-4 opacity-50" />
        <p>
          {language === 'en'
            ? 'No education or certifications data available'
            : 'Aucune donnée de formation ou certification disponible'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Filter Buttons */}
      {certificationsData.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {certTypes.map((type) => (
            <button
              key={type}
              onClick={() => onFilterChange(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedFilterNorm === type
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {type === 'all'
                ? language === 'en'
                  ? 'All'
                  : 'Tous'
                : type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      )}

      {/* Certifications Timeline */}
      {certificationsData.length > 0 && (
        <div className="relative">
          <div className="space-y-6">
            {/* Timeline Line */}
            <div className="absolute right-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary via-accent to-warning opacity-30" />

            {filteredCertifications.map((certification, index) => {
              const statusInfo = getStatusInfo(certification);
              // include selectedFilterNorm in key to force remount when the filter changes quickly
              const itemKey =
                certification?.id != null
                  ? `cert-${certification.id}-${selectedFilterNorm}`
                  : `cert-${index}-${selectedFilterNorm}`;

              return (
                <motion.div
                  key={itemKey}
                  data-index={index}
                  initial={{ opacity: 0, x: 24, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.36, ease: 'easeOut' }}
                  className="relative pr-20"
                >
                  {/* Timeline Dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 + 0.02, duration: 0.28, ease: 'easeOut' }}
                    className="absolute right-6 top-6 w-4 h-4 bg-secondary rounded-full border-4 border-background shadow-lg z-10"
                  />

                  {/* Certification Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 + 0.06, duration: 0.36, ease: 'easeOut' }}
                    className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-secondary/30"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Badge Image */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={certification?.badge}
                            alt={certification?.name?.[language] || ''}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Certification Details */}
                      <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">
                              {certification?.name?.[language] || certification?.name || ''}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {certification?.issuer || ''}
                            </p>
                          </div>
                          <div className="flex flex-col items-start sm:items-end space-y-1">
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-medium ${
                                statusInfo.key === 'active'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : statusInfo.key === 'expiring'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              }`}
                            >
                              {statusInfo.label}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {certification?.issueDate
                                ? new Date(certification.issueDate).toLocaleDateString(
                                    language === 'en' ? 'en-US' : 'fr-FR'
                                  )
                                : ''}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        {certification?.description?.[language] && (
                          <p className="text-sm text-muted-foreground">
                            {certification.description[language]}
                          </p>
                        )}

                        {/* Skills */}
                        {Array.isArray(certification?.skills) && certification.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {certification.skills.map((skill, idx) => (
                              <span
                                key={`skill-${idx}`}
                                className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Credential URL */}
                        {certification?.credentialUrl && (
                          <a
                            href={certification.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs text-primary hover:underline"
                          >
                            <Icon name="ExternalLink" size={14} />
                            {language === 'en' ? 'View credential' : 'Voir la certification'}
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
            {/* Education Section */}
      {educationData.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground">
            {language === 'en' ? 'Education' : 'Éducation'}
          </h2>
          {educationData.map((edu, index) => (
            <motion.div
              key={`edu-${index}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.36, ease: 'easeOut' }}
              className="bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {edu?.degree?.[language] || edu?.degree || ''}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {edu?.institution || ''}
                  </p>
                </div>
                <div className="flex flex-col items-start sm:items-end space-y-1">
                  <span className="text-xs text-muted-foreground">
                    {edu?.startDate
                      ? new Date(edu.startDate).toLocaleDateString(
                          language === 'en' ? 'en-US' : 'fr-FR',
                          { year: 'numeric', month: 'short' }
                        )
                      : ''}
                    {edu?.endDate
                      ? ' - ' +
                        new Date(edu.endDate).toLocaleDateString(
                          language === 'en' ? 'en-US' : 'fr-FR',
                          { year: 'numeric', month: 'short' }
                        )
                      : ''}
                  </span>
                </div>
              </div>

              {edu?.description?.[language] && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {edu.description[language]}
                </p>
              )}

              {Array.isArray(edu?.courses) && edu.courses.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {edu.courses.map((course, idx) => (
                    <span
                      key={`course-${idx}`}
                      className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificationsTimeline;