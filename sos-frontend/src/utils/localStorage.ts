import { ACCESS_TOKEN } from '../constants';

// Set Selected ACCESS_TOKEN into localstorage
export const setAccessToken = (value?: string) => {
  localStorage.setItem(ACCESS_TOKEN, value || '');
};

// GEt Selected ACCESS_TOKEN from localstorage
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN) || '';
};
