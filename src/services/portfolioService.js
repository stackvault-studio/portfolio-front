const API_BASE_URL = 'http://localhost:8081';

// REST API service for contact form submission
export const contactService = {
  async submitContactForm(formData) {
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          phone: formData.phone || null,
          company: formData.company || null,
          projectBudget: formData.project_budget || null,
          projectTimeline: formData.project_timeline || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to submit contact form');
      }

      return result;
    } catch (error) {
      console.error('Contact form submission error:', error);
      throw error;
    }
  }
};

// React hook for contact form submission (for backward compatibility)
export function useContactFormMutation() {
  return [
    async (options) => {
      try {
        const result = await contactService.submitContactForm(options.variables.input);
        return {
          data: {
            submitContactForm: {
              success: result.success,
              message: result.message,
            }
          }
        };
      } catch (error) {
        throw error;
      }
    },
    {
      loading: false,
      error: null,
      data: null,
    }
  ];
}
