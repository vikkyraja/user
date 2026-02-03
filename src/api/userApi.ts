// src/api/userApi.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiResponse, ApiUser, User } from '../types/user.types';
import config from '../config/env';

const apiClient: AxiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: { 'Content-Type': 'application/json' },
});

// Request logging (dev only)
apiClient.interceptors.request.use((config) => {
  if (config) console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message = error.response?.data?.error || error.message;
    return Promise.reject(new Error(message));
  }
);

// Transform API user to app User type
const transformUser = (apiUser: ApiUser): User => ({
  id: apiUser.login.uuid,
  firstName: apiUser.name.first,
  lastName: apiUser.name.last,
  fullName: `${apiUser.name.first} ${apiUser.name.last}`,
  email: apiUser.email,
  gender: apiUser.gender as 'male' | 'female',
  country: apiUser.location.country,
  city: apiUser.location.city,
  age: apiUser.dob.age,
  phone: apiUser.phone,
  picture: apiUser.picture.thumbnail,
  nationality: apiUser.nat,
});

// API functions
export const fetchUsers = async (count = config.pagination.maxResults): Promise<User[]> => {
  const { data } = await apiClient.get<ApiResponse>('/', {
    params: { results: count, nat: 'us', seed: 'user-table-app' },
  });
  return data.results.map(transformUser);
};

export const getUniqueCountries = (users: User[]): string[] =>
  [...new Set(users.map((user) => user.country))].sort();

export const getUniqueGenders = (users: User[]): string[] =>
  [...new Set(users.map((user) => user.gender))].sort();

export default apiClient;
