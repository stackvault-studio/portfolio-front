const API_BASE_URL = 'http://localhost:8081/api/ui';

// REST API service for education
export const educationService = {
  async getEducation() {
    try {
      const response = await fetch(`${API_BASE_URL}/education`);

      if (!response.ok) {
        throw new Error('Failed to fetch education data');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch education data');
      }

      // Transform backend data to frontend format
      return transformEducationData(result.data.educations || []);
    } catch (error) {
      console.error('Education fetch error:', error);
      throw error;
    }
  }
};

// Transform backend education data to frontend format
const transformEducationData = (educations) => {
  return educations.map((education, index) => ({
    id: index + 1,
    degree: {
      en: education.degree?.en || '',
      fr: education.degree?.fr || ''
    },
    institution: education.institution || '',
    location: {
      en: education.location?.en || '',
      fr: education.location?.fr || ''
    },
    period: {
      en: education.duration?.en || '',
      fr: education.duration?.fr || ''
    },
    gpa: education.gpa ? `${education.gpa}/4.0` : 'N/A',
    graduationYear: education.graduationYear || '',
    coursework: education.coursework ,
    projects: education.projects ,
    achievements: education.achievements ,
    image: education.image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop'
  }));
};

// REST API service for certifications
export const certificationService = {
  async getCertifications(filters = {}) {
    try {
      const queryParams = new URLSearchParams();

      if (filters.category && filters.category !== 'all') {
        queryParams.append('category', filters.category);
      }
      if (filters.issuer) {
        queryParams.append('issuer', filters.issuer);
      }
      if (filters.status) {
        queryParams.append('status', filters.status);
      }

      const url = `${API_BASE_URL}/api/ui/certifications${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch certifications');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch certifications');
      }

      return result.data;
    } catch (error) {
      console.error('Certifications fetch error:', error);
      throw error;
    }
  },

  async getCertificationCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/certifications/categories`);

      if (!response.ok) {
        throw new Error('Failed to fetch certification categories');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch certification categories');
      }

      return result.data;
    } catch (error) {
      console.error('Certification categories fetch error:', error);
      throw error;
    }
  }
};

// REST API service for skills progression
export const skillsProgressionService = {
  async getSkillsProgression() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/skills-progression`);

      if (!response.ok) {
        throw new Error('Failed to fetch skills progression data');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch skills progression data');
      }

      return result.data;
    } catch (error) {
      console.error('Skills progression fetch error:', error);
      throw error;
    }
  }
};

// Export individual functions for backward compatibility
export async function getEducation() {
  return educationService.getEducation();
}

export async function getCertifications(filters = {}) {
  return certificationService.getCertifications(filters);
}

export async function getCertificationCategories() {
  return certificationService.getCertificationCategories();
}

export async function getSkillsProgression() {
  return skillsProgressionService.getSkillsProgression();
}