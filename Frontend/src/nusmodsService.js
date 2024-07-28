import axios from 'axios';

const BASE_URL = 'https://api.nusmods.com/v2';

export const getModules = async (year = '2023-2024') => {
  try {
    const response = await axios.get(`${BASE_URL}/${year}/moduleInfo.json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching modules:', error);
    throw error;
  }
};

export const getModuleDetails = async (year = '2023-2024', moduleCode) => {
  try {
    const response = await axios.get(`${BASE_URL}/${year}/modules/${moduleCode}.json`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching module ${moduleCode} details:`, error);
    throw error;
  }
};
