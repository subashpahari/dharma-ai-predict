const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = {
  getAuthHeader: () => {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },

  async request(endpoint: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeader(),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'API request failed');
    }

    return response.json();
  },

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async get(endpoint: string) {
    return this.request(endpoint);
  }
};
