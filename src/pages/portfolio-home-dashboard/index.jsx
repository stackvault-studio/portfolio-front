import React from 'react';
import { getDashboardData } from '../../services/homeService';
import LoadingState from '../../components/ui/LoadingState';
import Header from '../../components/ui/Header';
import ScrollProgressIndicator from '../../components/ui/ScrollProgressIndicator';
import HeroSection from './components/HeroSection';
import SkillsOverview from './components/SkillsOverview';
import StatisticsSection from './components/StatisticsSection';
import ContactSidebar from './components/ContactSidebar';
import NavigationSection from './components/NavigationSection';
import { useLanguage } from '../../contexts/LanguageContext';

const PortfolioHomeDashboard = () => {
  const { language } = useLanguage();
  const { loading, error, data } = getDashboardData();

  if (loading) return <LoadingState />;
  if (error) return <div className="text-center text-red-500">{error.message}</div>;

  const dashboard = data.dashboard;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ScrollProgressIndicator />
      <main className="pt-16">
        <div id="portfolio-home-dashboard">
          <HeroSection language={language} yearsOfExperience={ dashboard?.stats?.yearsExperience } />
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-0">
              <SkillsOverview apiSkills={dashboard?.skills} language={language} />
              <StatisticsSection apiStats={dashboard?.stats} language={language} />
              <NavigationSection apiStats={dashboard?.stats} language={language} />
            </div>
            <div className="lg:col-span-1 order-first lg:order-last">
              <ContactSidebar language={language} />
            </div>
          </div>
        </div>

        {/* Contact Section Placeholder */}
        <section id="contact-section" className="py-20 bg-muted/5">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {language === 'fr' ? 'Contactez-moi' : 'Contact Me'}
            </h2>
            <p className="text-muted-foreground mb-8">
              {language === 'fr' ?'Prêt à discuter de votre prochain projet ? Contactez-moi pour une consultation gratuite.' :'Ready to discuss your next project? Contact me for a free consultation.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:ossema.abdennadher@gmail.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {language === 'fr' ? 'Envoyer un Email' : 'Send Email'}
              </a>
              <a
                href="tel:+33649446289"
                className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                {language === 'fr' ? 'Appeler' : 'Call Now'}
              </a>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
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

export default PortfolioHomeDashboard;