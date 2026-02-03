// src/store/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, TableFilters } from '../types/user.types';
import { SortingState } from '@tanstack/react-table';
import config from "../config/env";

interface UserState {
  users: User[];
  filteredUsers: User[];
  isLoading: boolean;
  error: string | null;
  pageIndex: number;
  pageSize: number;
  sorting: SortingState;
  filters: TableFilters;
  rowOrder: string[];
}

const initialFilters: TableFilters = {
  search: '',
  gender: '',
  country: '',
};

const initialState: UserState = {
  users: [],
  filteredUsers: [],
  isLoading: false,
  error: null,
  pageIndex: 0,
  pageSize: config.pagination.defaultPageSize,
  sorting: [],
  filters: initialFilters,
  rowOrder: [],
};

const filterUsers = (users: User[], filters: TableFilters): User[] => {
  return users.filter((user) => {
    const searchLower = filters.search.toLowerCase();
    const matchesSearch =
      !filters.search ||
      user.fullName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower);

    const matchesGender =
      !filters.gender || user.gender.toLowerCase() === filters.gender.toLowerCase();

    const matchesCountry =
      !filters.country || user.country.toLowerCase() === filters.country.toLowerCase();

    return matchesSearch && matchesGender && matchesCountry;
  });
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
      state.filteredUsers = filterUsers(action.payload, state.filters);
      state.rowOrder = action.payload.map((user) => user.id);
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPageIndex: (state, action: PayloadAction<number>) => {
      state.pageIndex = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.pageIndex = 0;
    },
    setSorting: (state, action: PayloadAction<SortingState>) => {
      state.sorting = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.filteredUsers = filterUsers(state.users, state.filters);
      state.pageIndex = 0;
    },
    setGenderFilter: (state, action: PayloadAction<string>) => {
      state.filters.gender = action.payload;
      state.filteredUsers = filterUsers(state.users, state.filters);
      state.pageIndex = 0;
    },
    setCountryFilter: (state, action: PayloadAction<string>) => {
      state.filters.country = action.payload;
      state.filteredUsers = filterUsers(state.users, state.filters);
      state.pageIndex = 0;
    },
    clearFilters: (state) => {
      state.filters = initialFilters;
      state.filteredUsers = state.users;
      state.pageIndex = 0;
    },
    reorderRows: (state, action: PayloadAction<{ activeId: string; overId: string }>) => {
      const { activeId, overId } = action.payload;
      const oldIndex = state.rowOrder.indexOf(activeId);
      const newIndex = state.rowOrder.indexOf(overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = [...state.rowOrder];
        newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, activeId);
        state.rowOrder = newOrder;

        const userMap = new Map(state.filteredUsers.map((u) => [u.id, u]));
        state.filteredUsers = newOrder
          .filter((id) => userMap.has(id))
          .map((id) => userMap.get(id)!);
      }
    },
  },
});

export const {
  setUsers,
  setLoading,
  setError,
  setPageIndex,
  setPageSize,
  setSorting,
  setSearch,
  setGenderFilter,
  setCountryFilter,
  clearFilters,
  reorderRows,
} = userSlice.actions;

export default userSlice.reducer;