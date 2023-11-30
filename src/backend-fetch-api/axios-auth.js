import axios from 'axios';
import axiosAuthRefresh from 'axios-auth-refresh';

// Function that will be called to refresh authorization
const refreshAuthLogic = (failedRequest) => {
  // Your refresh endpoint
  return axios.post('http://127.0.0.1:8000/token/refresh/')
    .then(tokenRefreshResponse => {
      return Promise.resolve();
    });
};

// Function to attach the new token
axiosAuthRefresh.setup({
  onRetry: (config) => {
    config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('access_token');
    return config;
  },
  onRefreshSuccess: (tokenRefreshResponse) => {
    localStorage.setItem('access_token', tokenRefreshResponse.data.access);
  },
  onRefreshFail: (error) => {
    // Handle any errors that occurred during the token refresh
    console.error('Failed to refresh token:', error);
  },
});

export default refreshAuthLogic;