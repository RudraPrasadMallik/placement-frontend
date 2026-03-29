// Central API Service
const BASE_URL = 'https://placement-backend-1-9jfq.onrender.com';
// 'http://localhost:8080/api';


// API endpoints configuration
const API = {
  // Statistics endpoints
  STATISTICS: {
    YEAR_WISE: `${BASE_URL}/statistics/year-wise`,
    DEPARTMENT_WISE: `${BASE_URL}/statistics/department-wise`,
    PACKAGE_DISTRIBUTION: `${BASE_URL}/statistics/package-distribution`,
    COMPANY_TYPES: `${BASE_URL}/statistics/company-types`,
  },
  
  // Student endpoints
  STUDENT: {
    REGISTER: `${BASE_URL}/students/register`,
  },
  
  // Company endpoints
  COMPANY: {
    REGISTER: `${BASE_URL}/companies/register`,
  },
  
  // Contact endpoints
  CONTACT: {
    SUBMIT: `${BASE_URL}/contact/submit`,
  },
  
  // Auth endpoints
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
  }
};

// Helper function for JSON API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Important for CORS with credentials
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || data || 'API call failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Export API methods
export const api = {
  // Statistics APIs
  getYearWiseStats: () => apiCall(API.STATISTICS.YEAR_WISE),
  getDepartmentWiseStats: () => apiCall(API.STATISTICS.DEPARTMENT_WISE),
  getPackageDistribution: () => apiCall(API.STATISTICS.PACKAGE_DISTRIBUTION),
  getCompanyTypes: () => apiCall(API.STATISTICS.COMPANY_TYPES),
  
  // Student APIs - Special handling for FormData
  registerStudent: async (formData) => {
    try {
      const response = await fetch(API.STUDENT.REGISTER, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Important for CORS with credentials
        // Don't set Content-Type header, browser will set it with boundary
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      return data;
    } catch (error) {
      console.error('Student registration error:', error);
      throw error;
    }
  },
  
  // Company APIs
  registerCompany: (companyData) => apiCall(API.COMPANY.REGISTER, {
    method: 'POST',
    body: JSON.stringify(companyData),
  }),
  
  // Contact APIs
  submitContact: (messageData) => apiCall(API.CONTACT.SUBMIT, {
    method: 'POST',
    body: JSON.stringify(messageData),
  }),
  
  // Auth APIs
  login: (credentials) => apiCall(API.AUTH.LOGIN, {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
};

export default api;