import { ACCESS_TOKEN, LOGIN_ROLE, LOGIN_USER_DETAILS } from '../constants';

// Set Selected ACCESS_TOKEN into localstorage
export const setAccessToken = (value?: string) => {
  localStorage.setItem(ACCESS_TOKEN, value || '');
};

// GEt Selected ACCESS_TOKEN from localstorage
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN) || '';
};

// Set Selected LOGIN_ROLE into localstorage
export const setLoginRole = (value?: string) => {
  localStorage.setItem(LOGIN_ROLE, value || '');
};

// GEt Selected LOGIN_ROLE from localstorage
export const getLoginRole = () => {
  return localStorage.getItem(LOGIN_ROLE) || '';
};

// Set Selected LOGIN_USERDETAILS into localstorage
export const setLoginUserDetails = (value?: string) => {
  localStorage.setItem(LOGIN_USER_DETAILS, value || '');
};

// GEt Selected LOGIN_USERDETAILS from localstorage
export const getLoginUserDetails = () => {
  if (localStorage.getItem(LOGIN_USER_DETAILS))
    return JSON.parse(localStorage.getItem(LOGIN_USER_DETAILS) || '');
  else window.location.href = '/login';
};
