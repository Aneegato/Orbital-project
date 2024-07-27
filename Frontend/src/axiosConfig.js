import axios from 'axios';

const baseURL = import.meta.env.MODE === 'production'
  ? import.meta.env.VITE_APP_API_URL
  : '/api'; // Use the proxy for development

const instance = axios.create({
  baseURL,
  withCredentials: true, // To handle cookies and authentication
});

export default instance;
