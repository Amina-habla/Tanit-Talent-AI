import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to headers if it exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);

export const fetchJobs = () => API.get('/jobs');
export const fetchJob = (id) => API.get(`/jobs/${id}`);
export const createJob = (jobData) => API.post('/jobs', jobData);

export const applyToJob = (jobId, formData) => API.post(`/applications/${jobId}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const fetchMyApplications = () => API.get('/applications/my');
export const fetchJobApplications = (jobId) => API.get(`/applications/${jobId}`);

export default API;
