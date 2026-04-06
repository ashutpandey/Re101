const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Generic API call function
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error);
    throw error;
  }
}

// Tools API
export const toolsAPI = {
  getAll: () => apiCall('/tools'),
  getCategories: () => apiCall('/tools/categories'),
  getByCategory: (category) => apiCall(`/tools/category/${category}`),
  getById: (id) => apiCall(`/tools/${id}`),
  create: (tool) => apiCall('/tools', { method: 'POST', body: JSON.stringify(tool) }),
  update: (id, tool) => apiCall(`/tools/${id}`, { method: 'PUT', body: JSON.stringify(tool) }),
  delete: (id) => apiCall(`/tools/${id}`, { method: 'DELETE' }),
};

// People API
export const peopleAPI = {
  getAll: () => apiCall('/people'),
  getById: (id) => apiCall(`/people/${id}`),
  create: (person) => apiCall('/people', { method: 'POST', body: JSON.stringify(person) }),
  update: (id, person) => apiCall(`/people/${id}`, { method: 'PUT', body: JSON.stringify(person) }),
  delete: (id) => apiCall(`/people/${id}`, { method: 'DELETE' }),
};

// Blogs API
export const blogsAPI = {
  getAll: () => apiCall('/blogs'),
  getLimited: (limit = 5) => apiCall(`/blogs/limited/${limit}`),
  getById: (id) => apiCall(`/blogs/${id}`),
  create: (blog) => apiCall('/blogs', { method: 'POST', body: JSON.stringify(blog) }),
  update: (id, blog) => apiCall(`/blogs/${id}`, { method: 'PUT', body: JSON.stringify(blog) }),
  delete: (id) => apiCall(`/blogs/${id}`, { method: 'DELETE' }),
};

// Communities API (Reddit & Discord)
export const communitiesAPI = {
  getAll: () => apiCall('/communities'),
  update: (data) => apiCall('/communities', { method: 'PUT', body: JSON.stringify(data) }),
};

// Health check
export const healthAPI = {
  check: () => apiCall('/health'),
};