// src/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchUsers, getUniqueCountries, getUniqueGenders } from '../api/userApi';
import { setUsers, setLoading, setError } from '../store/userSlice';
import { User } from '../types/user.types';

import config from '../config/env';

export const useUsers = (count: number = config.pagination.maxResults) => {
  const dispatch = useDispatch();

  const query = useQuery<User[], Error>({
    queryKey: ['users', count],
    queryFn: () => fetchUsers(count),
    staleTime: config.cache.staleTime,
    gcTime: config.cache.gcTime,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    dispatch(setLoading(query.isLoading));
  }, [query.isLoading, dispatch]);

  useEffect(() => {
    if (query.data) {
      dispatch(setUsers(query.data));
    }
  }, [query.data, dispatch]);

  useEffect(() => {
    if (query.error) {
      dispatch(setError(query.error.message));
    }
  }, [query.error, dispatch]);

  const countries = query.data ? getUniqueCountries(query.data) : [];
  const genders = query.data ? getUniqueGenders(query.data) : [];
console.log('Countries:', countries);
  return { ...query, countries, genders };
};

export const useUserState = () => {
  return useSelector((state: any) => state.users);
};