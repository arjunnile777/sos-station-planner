import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { LOGIN_ROUTE } from '../constants';
import { getAccessToken } from '../utils/localStorage';

type TokenExpiryResponse = AxiosError<{
  code: string;
  detail: string;
}>;

enum StatusCode {
  Unauthorized = 401,
  Forbidden = 403,
  TooManyRequests = 429,
  InternalServerError = 500,
  BadRequest = 400,
}
const TOKEN_EXPIRY_CODE = 'token_not_valid';
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
    const accessToken = getAccessToken();
    return assignTokenToHeader(config, accessToken);
  },
  error => {
    return Promise.reject(error);
  },
);

const unauthorizedResponseHandlerInterceptor = async (
  error: TokenExpiryResponse,
) => {
  const code = error.response && error.response.status;
  if (
    code === StatusCode.Unauthorized ||
    TOKEN_EXPIRY_CODE === error?.response?.data?.code
  ) {
    redirect(`/${LOGIN_ROUTE}`);
  }

  return Promise.reject(error);
};

http.interceptors.response.use(
  response => response,
  unauthorizedResponseHandlerInterceptor,
);

// Window Redirect utils, Don't used inside React Component
export const redirect = (location: string) => {
  window && window.location.assign(location);
};
