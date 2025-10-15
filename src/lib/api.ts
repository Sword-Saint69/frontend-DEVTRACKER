const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const api = {
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    signup: `${API_BASE_URL}/api/auth/signup`,
  },
  organization: {
    join: `${API_BASE_URL}/organization/join`,
    create: `${API_BASE_URL}/organization/create`,
  },
};

export default API_BASE_URL;