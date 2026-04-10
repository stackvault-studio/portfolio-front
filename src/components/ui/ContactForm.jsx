import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../AppIcon';
import Button from './Button';
import { contactService } from '../../services/portfolioService';

const ContactForm = ({ language = 'en', onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: '',
    company: '',
    project_budget: '',
    project_timeline: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const content = {
    en: {
      title: "Get In Touch",
      subtitle: "Ready to start your project? Let\'s discuss your requirements.",
      form: {
        name: "Full Name",
        namePlaceholder: "Your full name",
        email: "Email Address",
        emailPlaceholder: "your.email@company.com",
        phone: "Phone Number (Optional)",
        phonePlaceholder: "+33 6 12 34 56 78",
        company: "Company (Optional)",
        companyPlaceholder: "Your company name",
        subject: "Project Subject",
        subjectPlaceholder: "Brief description of your project",
        message: "Project Description",
        messagePlaceholder: "Tell me about your project requirements, timeline, and goals...",
        budget: "Project Budget (Optional)",
        budgetPlaceholder: "e.g., €10,000 - €50,000",
        timeline: "Project Timeline (Optional)",
        timelinePlaceholder: "e.g., 3 months",
        submit: "Send Message",
        submitting: "Sending..."
      },
      validation: {
        nameRequired: "Full name is required",
        emailRequired: "Email address is required",
        emailInvalid: "Please enter a valid email address",
        subjectRequired: "Project subject is required",
        messageRequired: "Project description is required",
        messageMinLength: "Please provide more details (minimum 20 characters)"
      },
      success: "Message sent successfully! I\'ll get back to you within 24 hours.",
      error: "Failed to send message. Please try again or contact me directly."
    },
    fr: {
      title: "Contactez-Moi",
      subtitle: "Prêt à commencer votre projet ? Discutons de vos exigences.",
      form: {
        name: "Nom Complet",
        namePlaceholder: "Votre nom complet",
        email: "Adresse Email",
        emailPlaceholder: "votre.email@entreprise.com",
        phone: "Numéro de Téléphone (Optionnel)",
        phonePlaceholder: "+33 6 12 34 56 78",
        company: "Entreprise (Optionnel)",
        companyPlaceholder: "Nom de votre entreprise",
        subject: "Sujet du Projet",
        subjectPlaceholder: "Description brève de votre projet",
        message: "Description du Projet",
        messagePlaceholder: "Parlez-moi des exigences, délais et objectifs de votre projet...",
        budget: "Budget du Projet (Optionnel)",
        budgetPlaceholder: "ex., €10,000 - €50,000",
        timeline: "Délai du Projet (Optionnel)",
        timelinePlaceholder: "ex., 3 mois",
        submit: "Envoyer le Message",
        submitting: "Envoi en cours..."
      },
      validation: {
        nameRequired: "Le nom complet est requis",
        emailRequired: "L\'adresse email est requise",
        emailInvalid: "Veuillez saisir une adresse email valide",
        subjectRequired: "Le sujet du projet est requis",
        messageRequired: "La description du projet est requise",
        messageMinLength: "Veuillez fournir plus de détails (minimum 20 caractères)"
      },
      success: "Message envoyé avec succès ! Je vous répondrai dans les 24 heures.",
      error: "Échec de l\'envoi du message. Veuillez réessayer ou me contacter directement."
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = content?.[language]?.validation?.nameRequired;
    }

    if (!formData?.email?.trim()) {
      newErrors.email = content?.[language]?.validation?.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = content?.[language]?.validation?.emailInvalid;
    }

    if (!formData?.subject?.trim()) {
      newErrors.subject = content?.[language]?.validation?.subjectRequired;
    }

    if (!formData?.message?.trim()) {
      newErrors.message = content?.[language]?.validation?.messageRequired;
    } else if (formData?.message?.trim()?.length < 20) {
      newErrors.message = content?.[language]?.validation?.messageMinLength;
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await contactService?.submitContactForm({
        name: formData?.name?.trim(),
        email: formData?.email?.trim(),
        subject: formData?.subject?.trim(),
        message: formData?.message?.trim(),
        phone: formData?.phone?.trim() || null,
        company: formData?.company?.trim() || null,
        project_budget: formData?.project_budget?.trim() || null,
        project_timeline: formData?.project_timeline?.trim() || null
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        phone: '',
        company: '',
        project_budget: '',
        project_timeline: ''
      });

      onSuccess?.(result?.message || content?.[language]?.success);
    } catch (error) {
      onError?.(content?.[language]?.error + ': ' + error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          {content?.[language]?.title}
        </h3>
        <p className="text-muted-foreground">
          {content?.[language]?.subtitle}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name and Email Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              {content?.[language]?.form?.name} *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData?.name}
              onChange={handleChange}
              placeholder={content?.[language]?.form?.namePlaceholder}
              className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${
                errors?.name ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
              }`}
            />
            {errors?.name && (
              <p className="mt-1 text-sm text-destructive flex items-center space-x-1">
                <Icon name="AlertCircle" size={14} />
                <span>{errors?.name}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              {content?.[language]?.form?.email} *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData?.email}
              onChange={handleChange}
              placeholder={content?.[language]?.form?.emailPlaceholder}
              className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${
                errors?.email ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
              }`}
            />
            {errors?.email && (
              <p className="mt-1 text-sm text-destructive flex items-center space-x-1">
                <Icon name="AlertCircle" size={14} />
                <span>{errors?.email}</span>
              </p>
            )}
          </div>
        </div>

        {/* Phone and Company Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
              {content?.[language]?.form?.phone}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData?.phone}
              onChange={handleChange}
              placeholder={content?.[language]?.form?.phonePlaceholder}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
              {content?.[language]?.form?.company}
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData?.company}
              onChange={handleChange}
              placeholder={content?.[language]?.form?.companyPlaceholder}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
            {content?.[language]?.form?.subject} *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData?.subject}
            onChange={handleChange}
            placeholder={content?.[language]?.form?.subjectPlaceholder}
            className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${
              errors?.subject ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
            }`}
          />
          {errors?.subject && (
            <p className="mt-1 text-sm text-destructive flex items-center space-x-1">
              <Icon name="AlertCircle" size={14} />
              <span>{errors?.subject}</span>
            </p>
          )}
        </div>

        {/* Budget and Timeline Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="project_budget" className="block text-sm font-medium text-foreground mb-2">
              {content?.[language]?.form?.budget}
            </label>
            <input
              type="text"
              id="project_budget"
              name="project_budget"
              value={formData?.project_budget}
              onChange={handleChange}
              placeholder={content?.[language]?.form?.budgetPlaceholder}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label htmlFor="project_timeline" className="block text-sm font-medium text-foreground mb-2">
              {content?.[language]?.form?.timeline}
            </label>
            <input
              type="text"
              id="project_timeline"
              name="project_timeline"
              value={formData?.project_timeline}
              onChange={handleChange}
              placeholder={content?.[language]?.form?.timelinePlaceholder}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
            {content?.[language]?.form?.message} *
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={formData?.message}
            onChange={handleChange}
            placeholder={content?.[language]?.form?.messagePlaceholder}
            className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-vertical ${
              errors?.message ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
            }`}
          />
          {errors?.message && (
            <p className="mt-1 text-sm text-destructive flex items-center space-x-1">
              <Icon name="AlertCircle" size={14} />
              <span>{errors?.message}</span>
            </p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            {formData?.message?.length || 0}/500 characters
          </p>
        </div>

        {/* Submit Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="submit"
            disabled={loading}
            iconName={loading ? "Loader2" : "Send"}
            iconPosition="left"
            size="lg"
            className="w-full"
          >
            {loading ? content?.[language]?.form?.submitting : content?.[language]?.form?.submit}
          </Button>
        </motion.div>
      </form>
    </div>
  );
};

export default ContactForm;