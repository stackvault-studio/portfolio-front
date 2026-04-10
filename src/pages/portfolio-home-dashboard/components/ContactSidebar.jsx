import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import ContactForm from '../../../components/ui/ContactForm';

const ContactSidebar = ({ language = 'en' }) => {
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState(null);

  const content = {
    en: {
      title: "Get In Touch",
      subtitle: "Ready to discuss your next project?",
      availability: "Available for Portage & Full-time",
      responseTime: "Usually responds within 24 hours",
      contact: {
        email: "Direct Email",
        phone: "Phone Call",
        linkedin: "LinkedIn",
        calendar: "Schedule Meeting"
      },
      getInTouch: "Send Message",
      location: "Paris, France",
      timezone: "CET (UTC+1)"
    },
    fr: {
      title: "Contactez-Moi",
      subtitle: "Prêt à discuter de votre prochain projet?",
      availability: "Disponible pour Portage & Temps Plein",
      responseTime: "Répond généralement sous 24 heures",
      contact: {
        email: "Email Direct",
        phone: "Appel Téléphonique",
        linkedin: "LinkedIn",
        calendar: "Planifier une Réunion"
      },
      getInTouch: "Envoyer un Message",
      location: "Paris, France",
      timezone: "CET (UTC+1)"
    }
  };

  const handleFormSuccess = (message) => {
    setNotification({ type: 'success', message });
    setShowForm(false);
    setTimeout(() => setNotification(null), 5000);
  };

  const handleFormError = (message) => {
    setNotification({ type: 'error', message });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <>
      <div className="sticky top-20 space-y-6 mt-36">
        {/* Notification */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border ${
              notification?.type === 'success' ?'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200' :'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Icon
                name={notification?.type === 'success' ? 'CheckCircle' : 'AlertCircle'}
                size={16}
              />
              <p className="text-sm font-medium">{notification?.message}</p>
            </div>
          </motion.div>
        )}

        {/* Contact Card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="User" size={24} className="text-white" />
            </div>
            
            <h3 className="text-xl font-bold text-foreground mb-2">
              {content?.[language]?.title}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {content?.[language]?.subtitle}
            </p>
            
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {content?.[language]?.availability}
              </span>
            </div>
            
            <p className="text-xs text-muted-foreground">
              {content?.[language]?.responseTime}
            </p>
          </div>

          {/* Contact Methods */}
          <div className="space-y-3 mb-6">
            <a
              href="mailto:ossema.abdennadher@gmail.com"
              className="w-full flex items-center space-x-3 p-3 bg-background hover:bg-muted/50 border border-border rounded-lg transition-colors group"
            >
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                <Icon name="Mail" size={18} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{content?.[language]?.contact?.email}</p>
                <p className="text-xs text-muted-foreground">ossema.abdennadher
                  @gmail.com</p>
              </div>
            </a>

            <a
              href="tel:+33649446289"
              className="w-full flex items-center space-x-3 p-3 bg-background hover:bg-muted/50 border border-border rounded-lg transition-colors group"
            >
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                <Icon name="Phone" size={18} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{content?.[language]?.contact?.phone}</p>
                <p className="text-xs text-muted-foreground">+33 6 49 44 62 89</p>
              </div>
            </a>

            <a
              href="https://www.linkedin.com/in/oussama-abdennadher-365454194/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center space-x-3 p-3 bg-background hover:bg-muted/50 border border-border rounded-lg transition-colors group"
            >
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                <Icon name="Linkedin" size={18} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{content?.[language]?.contact?.linkedin}</p>
                <p className="text-xs text-muted-foreground">Professional Network</p>
              </div>
            </a>
          </div>

          {/* Quick Contact Button */}
          <motion.button
            onClick={() => setShowForm(true)}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Icon name="MessageSquare" size={18} />
            <span>{content?.[language]?.getInTouch}</span>
          </motion.button>

          {/* Location & Timezone */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Icon name="MapPin" size={14} />
                <span>{content?.[language]?.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Icon name="Clock" size={14} />
                <span>{content?.[language]?.timezone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Contact Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">{content?.[language]?.getInTouch}</h2>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 bg-muted hover:bg-muted/80 rounded-lg flex items-center justify-center transition-colors"
              >
                <Icon name="X" size={16} className="text-muted-foreground" />
              </button>
            </div>
            
            <div className="p-6">
              <ContactForm
                language={language}
                onSuccess={handleFormSuccess}
                onError={handleFormError}
              />
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ContactSidebar;