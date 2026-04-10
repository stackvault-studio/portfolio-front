import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const HeroSection = ({ language, yearsOfExperience }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const content = {
    en: {
      greeting: "Hello, I'm",
      name: "Oussama Abdennadher",
      title: "Senior FullStack Developer",
      subtitle: "Java & BPM Specialist",
      description: `Passionate backend developer with `+ yearsOfExperience +`+ years of experience in Java ecosystem, 
microservices architecture, and Business Process Management. I transform complex business 
requirements into scalable, high-performance solutions that drive digital transformation.`,
      cta: "Evaluate mission match",
      contact: "Get In Touch",
      availability: "Available for new projects",
      location: "Paris, France"
    },
    fr: {
      greeting: "Bonjour, je suis",
      name: "Abdennadher Oussama",
      title: "Développeur FullStack Senior",
      subtitle: "Spécialiste Java & BPM",
      description: `Développeur backend passionné avec plus de `+ yearsOfExperience +` ans d'expérience dans l'écosystème Java, 
l'architecture microservices et la Gestion des Processus Métier. Je transforme les exigences 
métier complexes en solutions évolutives et performantes qui pilotent la transformation numérique.`,
      cta: "Évaluer la correspondance de la mission",
      contact: "Me Contacter",
      availability: "Disponible pour nouveaux projets",
      location: "Paris, France"
    }
  };

  const currentContent = content?.[language] || content?.en;

  const handleCalculateRate = () => {
    const element = document.getElementById('mission-rate-calculator');
    if (element) {
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleContact = () => {
    const element = document.getElementById('contact-section');
    if (element) {
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse animation-delay-400"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Greeting */}
            <div className="space-y-2">
              <p className="text-lg text-muted-foreground font-medium">
                {currentContent?.greeting}
              </p>
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                {currentContent?.name}
              </h1>
              <div className="space-y-1">
                <h2 className="text-2xl lg:text-3xl font-semibold text-primary">
                  {currentContent?.title}
                </h2>
                <p className="text-xl text-secondary font-medium">
                  {currentContent?.subtitle}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {currentContent?.description}
            </p>

            {/* Status Badge */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-success/10 text-success px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">{currentContent?.availability}</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Icon name="MapPin" size={16} />
                <span className="text-sm">{currentContent?.location}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="default"
                size="lg"
                onClick={handleCalculateRate}
                iconName="Calculator"
                iconPosition="left"
                className="group"
              >
                {currentContent?.cta}
                
                <Icon name="Sparkles" size={16} className="ml-2 group-hover:rotate-12 transition-transform" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleContact}
                iconName="Mail"
                iconPosition="left"
              >
                {currentContent?.contact}
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4 pt-4">
              <span className="text-sm text-muted-foreground">Connect:</span>
              <div className="flex space-x-3">
                {[
                  { name: 'Github', icon: 'Github' },
                  { name: 'Linkedin', icon: 'Linkedin' },
                  { name: 'Mail', icon: 'Mail' }
                ]?.map((social) => (
                  <button
                    key={social?.name}
                    className="w-10 h-10 bg-muted/50 hover:bg-primary/20 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                    aria-label={social?.name}
                  >
                    <Icon name={social?.icon} size={18} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Profile Image */}
          <div className={`relative transition-all duration-1000 animation-delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative mx-auto w-80 h-80 lg:w-96 lg:h-96">
              {/* Background Decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl rotate-6 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-accent/20 to-primary/20 rounded-3xl -rotate-6 animate-pulse animation-delay-200"></div>
              {/* Profile Image Container */}
              <div className="relative z-10 w-full h-full bg-card rounded-3xl overflow-hidden border border-border shadow-2xl">
                <Image
                  src="https://media.licdn.com/dms/image/v2/C5603AQG77XH0qREEaQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1569165836367?e=1761177600&v=beta&t=eVjzVfcmTxUe74aysm2jAgsoZF4qEkjEBF2sKBtCXlQ"
                  alt="Abdennadher Oussama - Senior Fullstack Developer"
                  className="w-full h-full object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent"></div>
                {/* Reduced opacity for more clarity */}
              </div>
              {/* Floating Elements (outside image container) */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg animate-bounce z-20 pointer-events-none">
                <Icon name="Spring" size={35} color="white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg animate-bounce animation-delay-400 z-20 pointer-events-none">
                <Icon name="Jenkins" size={35} color="#D24939" />
              </div>
              {/* JMS Icon */}
              <div className="absolute top-1/2 -right-10 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg animate-bounce animation-delay-200 z-20 pointer-events-none">
                <Icon name="KAFKA" size={35} color="#231F20" />
              </div>
              {/* DevOps Icon */}
              <div className="absolute bottom-1/2 -left-10 w-12 h-12 bg-muted rounded-xl flex items-center justify-center shadow-lg animate-bounce animation-delay-300 z-20 pointer-events-none">
                <Icon name="KUBERNETES" size={35} color="#326CE5" />
              </div>
              {/* BPM Icon */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary/90 rounded-2xl flex items-center justify-center shadow-lg animate-bounce animation-delay-500 z-20 pointer-events-none">
                <Icon name="CAMUNDA" size={35} color="#FF9800" />
              </div>
              {/* AWS Icon */}
              <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg animate-bounce animation-delay-600 z-20 pointer-events-none">
                <Icon name="AWS" size={35} color="#FF9900" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;