/**
 * Cookie utility functions for managing authentication tokens
 */

// Get cookie value by name
export const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null;
};

// Set cookie with options (simplified for development)
export const setCookie = (name, value, options = {}) => {
  if (typeof document === 'undefined') return;
  
  const defaultOptions = {
    path: '/',
    secure: false, // false for development (HTTP)
    sameSite: 'lax', // more permissive for development
    ...options
  };
  
  let cookieString = `${name}=${value}`;
  
  if (defaultOptions.expires) {
    cookieString += `; expires=${defaultOptions.expires.toUTCString()}`;
  }
  
  if (defaultOptions.maxAge) {
    cookieString += `; max-age=${defaultOptions.maxAge}`;
  }
  
  if (defaultOptions.path) {
    cookieString += `; path=${defaultOptions.path}`;
  }
  
  if (defaultOptions.domain) {
    cookieString += `; domain=${defaultOptions.domain}`;
  }
  
  if (defaultOptions.secure) {
    cookieString += '; secure';
  }
  
  if (defaultOptions.sameSite) {
    cookieString += `; samesite=${defaultOptions.sameSite}`;
  }
  
  if (defaultOptions.httpOnly) {
    cookieString += '; httpOnly';
  }
  
  document.cookie = cookieString;
};

// Delete cookie by name
export const deleteCookie = (name) => {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// Check if user is authenticated (has valid token)
export const isAuthenticated = () => {
  const token = getCookie('token');
  return !!token;
};

// Get authentication token
export const getAuthToken = () => {
  return getCookie('token');
};

// Clear all authentication data
export const clearAuth = () => {
  deleteCookie('token');
  // Clear any other auth-related data
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('isUserLoggedIn');
  }
};

// Set authentication token (simplified for development)
export const setAuthToken = (token, options = {}) => {
  const defaultOptions = {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: false, // Client-side cookies can't be httpOnly
    secure: false, // false for development (HTTP)
    sameSite: 'lax', // more permissive for development
    ...options
  };
  
  setCookie('token', token, defaultOptions);
};
