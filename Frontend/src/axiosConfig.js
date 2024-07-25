import axios from 'axios';

const baseURL = import.meta.env.MODE === 'production'
  ? import.meta.env.VITE_APP_API_URL
  : 'https://d3c0-218-144-19-223.ngrok-free.app';

const instance = axios.create({
  baseURL,
  withCredentials: true, // To handle cookies and authentication
});

export default instance;
