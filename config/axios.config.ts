import axios from "axios";
import Cookie from 'js-cookie';

const cookie = Cookie.get(process.env.NEXT_PUBLIC_COOKIES_NAME as string) || '';
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const authURL = process.env.NEXT_PUBLIC_AUTH_URL;

const httpClient = axios.create({
  baseURL: authURL,
});
httpClient.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json';
    config.headers['Authorization'] = `Bearer ${cookie}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default httpClient;
