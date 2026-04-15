import { API_UI_BASE } from '../config/api';

export async function getExperiences() {
  const response = await fetch(`${API_UI_BASE}/experience-timeline`);
  if (!response.ok) throw new Error('Failed to fetch experiences');
  return await response.json();
}

export async function getExperienceById(id) {
  try {
      const response = await fetch(`${API_UI_BASE}/experience-timeline/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch experience data');
      }
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch experience data');
      }

      return result.data;
    } catch (error) {
      console.error('experience data fetch error:', error);
      throw error;
    }
}