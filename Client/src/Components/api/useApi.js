import { useState, useCallback } from 'react';
import apiClient from './axiosConfig';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = useCallback(async (method, url, data = null, config = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient({
        method,
        url,
        data,
        ...config,
      });
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((url, config = {}) => {
    return makeRequest('GET', url, null, config);
  }, [makeRequest]);

  const post = useCallback((url, data = null, config = {}) => {
    return makeRequest('POST', url, data, config);
  }, [makeRequest]);

  const put = useCallback((url, data = null, config = {}) => {
    return makeRequest('PUT', url, data, config);
  }, [makeRequest]);

  const del = useCallback((url, config = {}) => {
    return makeRequest('DELETE', url, null, config);
  }, [makeRequest]);

  const patch = useCallback((url, data = null, config = {}) => {
    return makeRequest('PATCH', url, data, config);
  }, [makeRequest]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    clearError,
    get,
    post,
    put,
    delete: del,
    patch,
    makeRequest,
  };
};

export default useApi;
