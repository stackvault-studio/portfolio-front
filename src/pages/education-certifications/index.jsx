import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import SectionHeader from './components/SectionHeader';
import EducationTimeline from './components/EducationTimeline';
import CertificationsTimeline from './components/CertificationsTimeline';
import SkillsProgressionMap from './components/SkillsProgressionMap';
import ScrollProgressIndicator from '../../components/ui/ScrollProgressIndicator';
import Icon from '../../components/AppIcon';
import { useLanguage } from '../../contexts/LanguageContext';
import { getEducation, getCertifications } from '../../services/educationService';

const EducationCertifications = () => {
  const { language } = useLanguage();
  const [selectedFilter, setSelectedFilter] = React.useState('all');
  const [activeTab, setActiveTab] = React.useState('overview');
  const [educationData, setEducationData] = useState([]);
  const [certificationsData, setCertificationsData] = useState([]);
  const [skillsProgressionData, setSkillsProgressionData] = useState([]); // Set static data
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const handleLanguageChange = (event) => {
      setLanguage(event?.detail?.language);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  // Fetch data from API
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [education, certifications] = await Promise.all([
          getEducation(),
          getCertifications(),
        ]);
        setEducationData(education || []);
        setCertificationsData(certifications || []);
        setSkillsProgressionData(null);
        //setSkillsProgressionData(skillsProgression || null);
      } catch (error) {
        console.error('Failed to fetch education/certifications data:', error);
        // Set empty arrays as fallback
        setEducationData([]);
        setCertificationsData([]);
        setSkillsProgressionData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const tabOptions = [
    {
      id: 'overview',
      label: { en: 'Overview', fr: 'Aperçu' },
      icon: 'LayoutDashboard'
    },
    {
      id: 'education',
      label: { en: 'Education', fr: 'Éducation' },
      icon: 'GraduationCap'
    },
    {
      id: 'certifications',
      label: { en: 'Certifications', fr: 'Certifications' },
      icon: 'Award'
    },
    {
      id: 'skills-map',
      label: { en: 'Skills Map', fr: 'Carte des Compétences' },
      icon: 'Map'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      
      <Header />
      <ScrollProgressIndicator />
      <main className="pt-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-6 py-12"
        >
          {/* Section Header */}
          <motion.div variants={sectionVariants}>
            <SectionHeader language={language} />
          </motion.div>

          {/* Tab Navigation */}
          <motion.div variants={sectionVariants} className="mb-12">
            <div className="flex flex-wrap justify-center gap-2 bg-card border border-border rounded-xl p-2">
              {tabOptions?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab?.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label?.[language]}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content Sections */}
          <motion.div variants={sectionVariants}>
            {activeTab === 'overview' && (
              <div className="space-y-16">
                {/* Skills Progression Map */}
                <section id="skills-progression" className="scroll-mt-20">
                  <SkillsProgressionMap language={language} skillsData={skillsProgressionData} />
                </section>

                {/* Dual Timeline Layout */}
                <section id="dual-timeline" className="scroll-mt-20">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                    {/* Education Timeline */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3 mb-8">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Icon name="GraduationCap" size={20} className="text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">
                          {language === 'en' ? 'Educational Journey' : 'Parcours Éducatif'}
                        </h2>
                      </div>
                      <EducationTimeline language={language} educationData={educationData} />
                    </div>

                    {/* Certifications Timeline */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3 mb-8">
                        <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                          <Icon name="Award" size={20} className="text-secondary" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">
                          {language === 'en' ? 'Professional Certifications' : 'Certifications Professionnelles'}
                        </h2>
                      </div>
                      <CertificationsTimeline
                        language={language}
                        selectedFilter={selectedFilter}
                        onFilterChange={setSelectedFilter}
                        certificationsData={certificationsData.certifications}
                      />
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'education' && (
              <section id="education-only" className="scroll-mt-20">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="GraduationCap" size={24} className="text-primary" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-foreground">
                        {language === 'en' ? 'Educational Background' : 'Formation Académique'}
                      </h2>
                      <p className="text-muted-foreground">
                        {language === 'en' ?'Academic achievements and learning milestones' :'Réalisations académiques et jalons d\'apprentissage'
                        }
                      </p>
                    </div>
                  </div>
                  <EducationTimeline language={language} educationData={educationData} />
                </div>
              </section>
            )}

            {activeTab === 'certifications' && (
              <section id="certifications-only" className="scroll-mt-20">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Icon name="Award" size={24} className="text-secondary" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-foreground">
                        {language === 'en' ? 'Professional Certifications' : 'Certifications Professionnelles'}
                      </h2>
                      <p className="text-muted-foreground">
                        {language === 'en' ?'Industry-recognized credentials and expertise validation' :'Références reconnues par l\'industrie et validation d\'expertise'
                        }
                      </p>
                    </div>
                  </div>
                  <CertificationsTimeline
                    language={language}
                    selectedFilter={selectedFilter}
                    onFilterChange={setSelectedFilter}
                    certificationsData={certificationsData.certifications}
                  />
                </div>
              </section>
            )}

            {activeTab === 'skills-map' && (
              <section id="skills-map-only" className="scroll-mt-20">
                <div className="max-w-6xl mx-auto">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                      <Icon name="Map" size={24} className="text-accent" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-foreground">
                        {language === 'en' ? 'Skills Progression Journey' : 'Parcours de Progression des Compétences'}
                      </h2>
                      <p className="text-muted-foreground">
                        {language === 'en' ?'Visual representation of how education and certifications shaped my expertise' :'Représentation visuelle de la façon dont l\'éducation et les certifications ont façonné mon expertise'
                        }
                      </p>
                    </div>
                  </div>
                  <SkillsProgressionMap language={language} skillsData={skillsProgressionData} />
                </div>
              </section>
            )}
          </motion.div>

          {/* Call to Action */}
          <motion.div variants={sectionVariants} className="mt-20 text-center">
            <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 border border-border">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {language === 'en' ?'Ready to Collaborate?' :'Prêt à Collaborer ?'
                }
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                {language === 'en' ?'With a strong educational foundation and industry-recognized certifications, I\'m equipped to tackle complex backend challenges and deliver exceptional results.' :'Avec une solide base éducative et des certifications reconnues par l\'industrie, je suis équipé pour relever des défis backend complexes et livrer des résultats exceptionnels.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <Icon name="MessageCircle" size={18} />
                  <span>{language === 'en' ? 'Get in Touch' : 'Prendre Contact'}</span>
                </button>
                <button className="px-6 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-muted/50 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <Icon name="Download" size={18} />
                  <span>{language === 'en' ? 'Download CV' : 'Télécharger CV'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
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

export default EducationCertifications;