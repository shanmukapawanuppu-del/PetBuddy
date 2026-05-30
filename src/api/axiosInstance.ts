import axios from 'axios';
import { toast } from '../context/ToastContext';

const axiosInstance = axios.create();

// ─── Response Interceptor ─────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => {
    // Show success toast only for mutating methods (POST, PUT, PATCH, DELETE)
    const method = response.config.method?.toUpperCase();
    const message = response.data?.message;

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method ?? '') && message) {
      toast(message, 'success');
    }

    return response;
  },
  (error) => {
    const serverMessage = error.response?.data?.error || error.response?.data?.message;

    if (serverMessage) {
      toast(serverMessage, 'error');
    } else if (error.message === 'Network Error') {
      toast('Network error. Please check your connection.', 'error');
    } else if (error.response?.status === 401) {
      toast('Session expired. Please log in again.', 'error');
    } else if (error.response?.status === 403) {
      toast('You do not have permission to perform this action.', 'error');
    } else if (error.response?.status === 500) {
      toast('Server error. Please try again later.', 'error');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
