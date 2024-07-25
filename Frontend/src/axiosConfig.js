import axios from 'axios';

const baseURL = import.meta.env.MODE === 'production'
  ? import.meta.env.VITE_APP_API_URL // Ensure this environment variable is set in your production environment
  : 'http://localhost:5001'; // Replace with your local backend URL

const instance = axios.create({
  baseURL,
  withCredentials: true, // To handle cookies and authentication
});

export default instance;
