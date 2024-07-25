import axios from 'axios';

const baseURL = import.meta.env.MODE === 'production'
  ? 'https://timenus-backend.vercel.app/' // Replace with your production backend URL
  : '/api'; // This will be proxied to your local backend server

const instance = axios.create({
  baseURL,
  withCredentials: true, // To handle cookies and authentication
});

export default instance;
