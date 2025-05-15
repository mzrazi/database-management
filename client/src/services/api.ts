import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints for entries
export const getEntries = async (params = {}) => {
  try {
    const response = await api.get('/entries', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching entries:', error);
    throw error;
  }
};

export const getEntryById = async (id) => {
  try {
    const response = await api.get(`/entries/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching entry ${id}:`, error);
    throw error;
  }
};

export const createEntry = async (data) => {
  try {
    const response = await api.post('/entries', data);
    return response.data;
  } catch (error) {
    console.error('Error creating entry:', error);
    throw error;
  }
};

export const updateEntry = async (id, data) => {
  try {
    const response = await api.put(`/entries/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating entry ${id}:`, error);
    throw error;
  }
};

export const deleteEntry = async (id) => {
  try {
    const response = await api.delete(`/entries/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting entry ${id}:`, error);
    throw error;
  }
};

export default api;