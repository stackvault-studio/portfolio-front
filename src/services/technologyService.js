import { API_UI_BASE } from '../config/api';

// REST API service for technologies
export const technologyService = {
  async getTechnologies() {
    try {
      const url = `${API_UI_BASE}/technologies-showcase`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch technologies');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch technologies');
      }

      // Return the raw technologies array (caller will normalize/localize)
      return result.data;
    } catch (error) {
      console.error('Technologies fetch error:', error);
      throw error;
    }
  }
};

// Export individual function
export async function getTechnologies() {
  return technologyService.getTechnologies();
}