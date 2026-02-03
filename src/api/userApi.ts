// src/api/userApi.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiResponse, ApiUser, User } from '../types/user.types';
import config from '../config/env';

const apiClient: AxiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (requestConfig) => {
    if (config.isDev) {
      console.log(`[API] ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`);
    }
    return requestConfig;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message = error.response?.data
      ? (error.response.data as { error?: string }).error || error.message
      : error.message;
    return Promise.reject(new Error(message));
  }
);

// Transform API user to User type
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

// Fetch users
export const fetchUsers = async (count: number = config.pagination.maxResults): Promise<User[]> => {
  const response = await apiClient.get<ApiResponse>('/', {
    params: {
      results: count,
      nat: 'us',
      seed: 'user-table-app',
    },
  });
  return response.data.results.map(transformUser);
};

export const getUniqueCountries = (users: User[]): string[] => {
  return [...new Set(users.map((user) => user.country))].sort();
};

export const getUniqueGenders = (users: User[]): string[] => {
  return [...new Set(users.map((user) => user.gender))].sort();
};

export default apiClient;