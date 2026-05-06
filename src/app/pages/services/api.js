// Central API Service
const BASE_URL =
'http://localhost:8080/api';


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
    PROFILE: `${BASE_URL}/students/profile`,
    ME: `${BASE_URL}/students/me`,
    REGISTRATION_OPTIONS: `${BASE_URL}/students/registration-options`,
    APPLICATIONS: `${BASE_URL}/students/applications`,
    SEMESTERS: `${BASE_URL}/students/profile/semesters`,
  },
  
  // Company endpoints
  COMPANY: {
    REGISTER: `${BASE_URL}/companies/register`,
    PROFILE: `${BASE_URL}/companies/profile`,
    ME: `${BASE_URL}/companies/me`,
    JOBS: `${BASE_URL}/companies/jobs`,
  },

  JOBS: {
    COMPANIES: `${BASE_URL}/jobs/companies`,
  },
  
  // Contact endpoints
  CONTACT: {
    SUBMIT: `${BASE_URL}/contact/submit`,
  },
  
  // Auth endpoints
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    LOGOUT: `${BASE_URL}/auth/logout`,
  },

  ADMIN: {
    DASHBOARD: `${BASE_URL}/admin/dashboard`,
    REGISTRATION_OPTIONS: `${BASE_URL}/admin/registration-options`,
    STUDENTS: `${BASE_URL}/admin/students`,
  }
};

export const getStoredAuth = () => {
  const raw = localStorage.getItem("placementAuth") || localStorage.getItem("studentAuth");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem("placementAuth");
    localStorage.removeItem("studentAuth");
    return null;
  }
};

export const clearStoredAuth = () => {
  localStorage.removeItem("placementAuth");
  localStorage.removeItem("studentAuth");
};

export const setStoredAuth = (authData) => {
  localStorage.setItem("placementAuth", JSON.stringify(authData));
};

export const getAuthToken = () => {
  const auth = getStoredAuth();
  if (!auth?.token) {
    return null;
  }

  if (auth.expiresAt && Date.now() >= auth.expiresAt) {
    clearStoredAuth();
    return null;
  }

  return auth.token;
};

const createApiError = (data, fallbackMessage) => {
  const error = new Error(data?.message || fallbackMessage);
  error.fieldErrors = data?.fieldErrors || {};
  if (data?.field) {
    error.field = data.field;
  }
  return error;
};

// Helper function for JSON API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const { includeAuth = true, ...fetchOptions } = options;
    const token = includeAuth ? getAuthToken() : null;
    const response = await fetch(endpoint, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...fetchOptions.headers,
      },
    });
    
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json()
      : await response.text();
    
    if (!response.ok) {
      if (typeof data === 'string') {
        throw new Error(data || 'API call failed');
      }
      throw createApiError(data, 'API call failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

const updateProfile = async (endpoint, payload, fallbackMessage) => {
  try {
    return await apiCall(endpoint, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw error || new Error(fallbackMessage);
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
        // Don't set Content-Type header, browser will set it with boundary
      });
      
      const contentType = response.headers.get('content-type') || '';
      const data = contentType.includes('application/json')
        ? await response.json()
        : await response.text();
      if (!response.ok) {
        if (typeof data === 'string') {
          throw new Error(data || 'Registration failed');
        }
        throw createApiError(data, 'Registration failed');
      }
      return data;
    } catch (error) {
      console.error('Student registration error:', error);
      throw error;
    }
  },

  getStudentRegistrationOptions: () => apiCall(API.STUDENT.REGISTRATION_OPTIONS, {
    includeAuth: false,
  }),

  getStudentAppliedJobs: () => apiCall(API.STUDENT.APPLICATIONS),

  applyForJob: (jobId) => apiCall(`${API.STUDENT.APPLICATIONS}/${jobId}`, {
    method: "POST",
  }),

  getStudentProfile: async () => {
    const profileEndpoints = [API.STUDENT.PROFILE, API.STUDENT.ME];
    let lastError = null;

    for (const endpoint of profileEndpoints) {
      try {
        return await apiCall(endpoint);
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error("Unable to load student profile");
  },

  updateStudentProfile: (studentData) =>
    updateProfile(API.STUDENT.PROFILE, studentData, "Unable to update student profile"),

  updateStudentResume: async (resumeFile) => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("resume", resumeFile);

    const response = await fetch(`${API.STUDENT.PROFILE}/resume`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      if (typeof data === "string") {
        throw new Error(data || "Resume update failed");
      }
      throw createApiError(data, "Resume update failed");
    }

    return data;
  },

  deleteStudentResume: async () => {
    return apiCall(`${API.STUDENT.PROFILE}/resume`, {
      method: "DELETE",
    });
  },

  updateStudentMarksheet: async (marksheetFile) => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("marksheet", marksheetFile);

    const response = await fetch(`${API.STUDENT.PROFILE}/marksheet`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      if (typeof data === "string") {
        throw new Error(data || "Marksheet update failed");
      }
      throw createApiError(data, "Marksheet update failed");
    }

    return data;
  },

  deleteStudentMarksheet: () => apiCall(`${API.STUDENT.PROFILE}/marksheet`, {
    method: "DELETE",
  }),

  getStudentSemesterRecords: () => apiCall(API.STUDENT.SEMESTERS),

  createStudentSemesterRecord: async ({ semesterName, percentage, marksheet }) => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("semesterName", semesterName);
    if (percentage !== undefined && percentage !== null && percentage !== "") {
      formData.append("percentage", String(percentage));
    }
    if (marksheet) {
      formData.append("marksheet", marksheet);
    }

    const response = await fetch(API.STUDENT.SEMESTERS, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      if (typeof data === "string") {
        throw new Error(data || "Semester record creation failed");
      }
      throw createApiError(data, "Semester record creation failed");
    }

    return data;
  },

  deleteStudentSemesterRecord: (recordId) => apiCall(`${API.STUDENT.SEMESTERS}/${recordId}`, {
    method: "DELETE",
  }),
  
  // Company APIs
  registerCompany: async (companyData) => {
    try {
      const response = await fetch(API.COMPANY.REGISTER, {
        method: 'POST',
        body: companyData,
      });

      const contentType = response.headers.get('content-type') || '';
      const data = contentType.includes('application/json')
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        if (typeof data === 'string') {
          throw new Error(data || 'Registration failed');
        }
        throw createApiError(data, 'Registration failed');
      }

      return data;
    } catch (error) {
      console.error('Company registration error:', error);
      throw error;
    }
  },

  getCompanyProfile: async () => {
    const profileEndpoints = [API.COMPANY.PROFILE, API.COMPANY.ME];
    let lastError = null;

    for (const endpoint of profileEndpoints) {
      try {
        return await apiCall(endpoint);
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error("Unable to load company profile");
  },

  updateCompanyProfile: (companyData) =>
    updateProfile(API.COMPANY.PROFILE, companyData, "Unable to update company profile"),

  getCompanyJobs: () => apiCall(API.COMPANY.JOBS),

  createCompanyJob: async (jobData) => {
    const token = getAuthToken();
    const response = await fetch(API.COMPANY.JOBS, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: jobData,
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      if (typeof data === 'string') {
        throw new Error(data || 'Job creation failed');
      }
      throw createApiError(data, 'Job creation failed');
    }

    return data;
  },

  getPublicCompanyJobs: () => apiCall(API.JOBS.COMPANIES, {
    includeAuth: false,
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
    includeAuth: false,
  }),

  logout: () => apiCall(API.AUTH.LOGOUT, {
    method: 'POST',
  }),

  getAdminDashboard: () => apiCall(API.ADMIN.DASHBOARD),
  getAdminRegistrationOptions: (type) => apiCall(`${API.ADMIN.REGISTRATION_OPTIONS}/${type}`),
  createAdminRegistrationOption: (type, payload) => apiCall(`${API.ADMIN.REGISTRATION_OPTIONS}/${type}`, {
    method: "POST",
    body: JSON.stringify(payload),
  }),
  deleteAdminRegistrationOption: (optionId) => apiCall(`${API.ADMIN.REGISTRATION_OPTIONS}/${optionId}`, {
    method: "DELETE",
  }),
  getAdminStudents: () => apiCall(API.ADMIN.STUDENTS),
};

export default api;
