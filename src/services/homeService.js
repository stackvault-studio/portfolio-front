import { API_UI_BASE } from '../config/api';

// REST API service for dashboard data
export const dashboardService = {
  async getDashboardData() {
    try {
      const response = await fetch(`${API_UI_BASE}/dashboard`);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch dashboard data');
      }

      return result.data;
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      throw error;
    }
  }
};

// React hook for dashboard data (for backward compatibility with existing components)
export function getDashboardData() {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await dashboardService.getDashboardData();
        setData({ dashboard: result });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    loading,
    error,
    data
  };
}

// Import React for the hook
import React from 'react';