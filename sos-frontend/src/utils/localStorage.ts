import {
  ACCESS_TOKEN,
  LOGIN_ROLE,
  LOGIN_USER_DETAILS,
  ORDER_STATUS_CHANGE,
} from '../constants';

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

// Set Selected LOGIN_USERDETAILS into sessionStorage
export const setLoginUserDetails = (value?: string) => {
  sessionStorage.setItem(LOGIN_USER_DETAILS, value || '');
};

// GEt Selected LOGIN_USERDETAILS from sessionStorage
export const getLoginUserDetails = () => {
  if (sessionStorage.getItem(LOGIN_USER_DETAILS))
    return JSON.parse(sessionStorage.getItem(LOGIN_USER_DETAILS) || '');
  else window.location.href = '/login';
};

// Set dispatch event from planning page for client.
export const setDispatchEvent = (value?: string) => {
  localStorage.setItem(ORDER_STATUS_CHANGE, value || '');
};

// remove dispatch event from planning page for client.
export const removeDispatchEvent = (value?: string) => {
  localStorage.removeItem(ORDER_STATUS_CHANGE);
};
