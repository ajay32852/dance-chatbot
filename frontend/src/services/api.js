import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000, // 60 seconds (LLM can be slow)
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Send a message to the chatbot
 * @param {string} message - User's question
 * @param {Array} history - Previous chat messages
 * @returns {Promise} Response with answer and sources
 */
export const sendMessage = async (message, history = []) => {
  try {
    const response = await api.post('/chat', {
      message,
      history,
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. The AI is taking too long. Please try again.');
    }
    if (error.response) {
      throw new Error(`Server error: ${error.response.status}`);
    }
    if (error.request) {
      throw new Error('Cannot connect to server. Make sure backend is running on port 8000.');
    }
    throw new Error('Something went wrong. Please try again.');
  }
};

/**
 * Check if backend is healthy
 * @returns {Promise} Health status
 */
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
};

export default api;
