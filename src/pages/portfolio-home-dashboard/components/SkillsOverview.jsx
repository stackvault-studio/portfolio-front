import React, { useState, useEffect, useRef, useMemo } from 'react';
import Icon from '../../../components/AppIcon';

function interpolateColor(rate) {
  const value = Math.max(0, Math.min(10, Number(rate || 0)));
  const hue = 120 - Math.round((value / 10) * 120);
  return `hsl(${hue} 80% 45%)`;
}

const AUTO_SLIDE_DELAY = 5000;

// Fixed, healthy colors for progress/icons + a neutral glow that won't tint the slide
const colorClasses = {
  primary: { bar: 'bg-emerald-500', text: 'text-emerald-600', glow: 'bg-white/8' },
  secondary: { bar: 'bg-sky-500', text: 'text-sky-600', glow: 'bg-white/8' },
  accent: { bar: 'bg-orange-500', text: 'text-orange-600', glow: 'bg-white/8' },
  warning: { bar: 'bg-amber-500', text: 'text-amber-600', glow: 'bg-white/8' },
  success: { bar: 'bg-green-500', text: 'text-green-600', glow: 'bg-white/8' },
  blue: { bar: 'bg-blue-500', text: 'text-blue-600', glow: 'bg-white/8' },       // Messaging
  gray: { bar: 'bg-neutral-400', text: 'text-neutral-600', glow: 'bg-white/8' }, // Tools
  purple: { bar: 'bg-violet-500', text: 'text-violet-600', glow: 'bg-white/8' }, // Cloud
};

const SkillsOverview = ({ apiSkills, language }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const intervalRef = useRef(null);

  /* ---------- Intersection Observer ---------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* ---------- Auto Slide ---------- */
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % skills.length);
    }, AUTO_SLIDE_DELAY);
    return () => clearInterval(intervalRef.current);
  }, [activeIndex]);

  const content = {
    en: {
      title: 'Core Technologies',
      subtitle: 'A focused view of expertise across modern backend & cloud systems',
    },
    fr: {
      title: 'Technologies Principales',
      subtitle: 'Vue ciblée des expertises backend et cloud modernes',
    },
  };

  const staticCategories = [
    { category: { en: 'Web Development', fr: 'Développement Web', id: 'LANGUAGE' }, icon: 'Server', color: 'primary' },
    { category: { en: 'Business Process Management', fr: 'Gestion des Processus Métier', id: 'BPM' }, icon: 'GitBranch', color: 'secondary' },
    { category: { en: 'Database & Storage', fr: 'Base de Données & Stockage', id: 'DATABASE' }, icon: 'Database', color: 'accent' },
    { category: { en: 'DevOps', fr: 'DevOps', id: 'DEVOPS' }, icon: 'Settings', color: 'warning' },
    { category: { en: 'Messaging System', fr: 'Système de Messagerie', id: 'MESSAGING' }, icon: 'MessageCircle', color: 'blue' },
    { category: { en: 'Testing', fr: 'Tests', id: 'TESTING' }, icon: 'CheckCircle', color: 'success' },
    { category: { en: 'Tools', fr: 'Outils', id: 'TOOLS' }, icon: 'Wrench', color: 'gray' },
    { category: { en: 'Cloud', fr: 'Cloud', id: 'CLOUD' }, icon: 'Cloud', color: 'purple' },
  ];

  const skills = useMemo(() => {
    const safeApi = Array.isArray(apiSkills) ? apiSkills : [];
    return staticCategories.map(category => {
      const apiCategory = safeApi.find(s => s?.category === category.category.id);
      return {
        ...category,
        technologies:
          apiCategory?.technologies
            ?.slice()
            .sort((a, b) => (b?.rate || 0) - (a?.rate || 0))
            .slice(0, 3)
            .map(t => ({ name: t?.name, rate: t?.rate ?? 0, icon: t?.name })) || [],
      };
    });
  }, [apiSkills]);

  const currentContent = content[language] || content.en;
    return (
    <section
      ref={sectionRef}
      className="py-28 bg-gradient-to-b from-muted/5 via-muted/10 to-muted/5 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            {currentContent.title}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {currentContent.subtitle}
          </p>
        </div>

        {/* Slider */}
        <div className="relative">
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(.4,0,.2,1)]"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {skills.map((skillGroup, index) => {
              const colors = colorClasses[skillGroup.color];
              return (
                <div key={index} className="min-w-full px-4">
                  <div className="
                    relative min-h-[420px] lg:min-h-[480px]
                    bg-card/80 backdrop-blur-xl
                    border border-border/60
                    rounded-[2rem]
                    p-10
                    shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]
                    transition-all duration-500
                  ">

                    {/* Glow */}
                    <div className={`absolute inset-0 rounded-[2rem] ${colors.glow} blur-3xl`} />

                    {/* Header */}
                    <div className="relative flex items-center space-x-5 mb-10">
                      <div className={`w-14 h-14 rounded-2xl ${colors.glow} flex items-center justify-center`}>
                        <Icon name={skillGroup.icon} size={26} className={colors.text} />
                      </div>
                      <h3 className="text-2xl font-semibold tracking-tight">
                        {skillGroup.category[language] || skillGroup.category.en}
                      </h3>
                    </div>

                    {/* Technologies */}
                    <div className="relative space-y-8">
                      {skillGroup.technologies.map((tech, techIndex) => (
                        <div key={techIndex}>
                          <div className="flex justify-between mb-3">
                            <span className="font-medium text-lg">{tech.name}</span>
                            <span
                              className="font-semibold"
                              style={{ color: interpolateColor(tech.rate) }}
                            >
                              {Math.round(tech.rate)} ★
                            </span>
                          </div>

                          <div className="h-2.5 bg-muted/30 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${colors.bar} rounded-full transition-all duration-1000`}
                              style={{
                                width: `${(tech.rate / 10) * 100}%`,
                                transitionDelay: `${techIndex * 150}ms`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Arrows */}
          <button
            onClick={() => setActiveIndex(i => (i - 1 + skills.length) % skills.length)}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur border rounded-full p-4 shadow-lg hover:scale-110 transition"
          >
            <Icon name="ChevronLeft" size={20} />
          </button>

          <button
            onClick={() => setActiveIndex(i => (i + 1) % skills.length)}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur border rounded-full p-4 shadow-lg hover:scale-110 transition"
          >
            <Icon name="ChevronRight" size={20} />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-12 space-x-3">
          {skills.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-3 rounded-full transition-all duration-300 ${
                activeIndex === i
                  ? 'w-8 bg-primary'
                  : 'w-3 bg-muted hover:bg-muted-foreground/40'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default SkillsOverview;