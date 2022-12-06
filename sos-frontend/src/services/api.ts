import axios, { AxiosRequestConfig } from 'axios';
import { getAccessToken } from '../utils/localStorage';

// const HOST_NAME = window.location.origin;
const HOST_NAME = 'http://localhost:4000';
const API_BASE_URL = `${HOST_NAME}/api`;

export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const assignTokenToHeader = (
  config: AxiosRequestConfig,
  accessToken: string,
) => {
  if (config.headers && accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
};

http.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // const accessToken = getAccessToken();
    const accessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFyanVubmlsZSIsInVzZXJJZCI6NCwiaWF0IjoxNjcwMzIzNjc0LCJleHAiOjE2NzA5Mjg0NzR9.Kyv3vSHtLwcIBTTlJ-yyNJh8lRWL_wzmPsbxhpTK54Y';
    return assignTokenToHeader(config, accessToken);
  },
  error => {
    return Promise.reject(error);
  },
);
