// __tests__/UserTable.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../src/store/slices/userSlice';
import { TableProvider } from '../src/context/TableContext';
import { UserTable } from '../src/components/UserTable';
import SearchBar from '../src/components/Filters/SearchBar';
import Pagination from '../src/components/Pagination/Pagination';
import { User } from '../src/types/user.types';

// Mock data
const mockUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: `user-${i + 1}`,
  firstName: `FirstName${i + 1}`,
  lastName: `LastName${i + 1}`,
  fullName: `FirstName${i + 1} LastName${i + 1}`,
  email: `user${i + 1}@example.com`,
  gender: (i % 2 === 0 ? 'male' : 'female') as 'male' | 'female',
  country: i % 3 === 0 ? 'United States' : i % 3 === 1 ? 'Canada' : 'Germany',
  city: `City${i + 1}`,
  age: 20 + (i % 50),
  phone: `(555) 000-${String(i + 1).padStart(4, '0')}`,
  picture: `https://randomuser.me/api/portraits/thumb/${i % 2 === 0 ? 'men' : 'women'}/${i + 1}.jpg`,
  nationality: 'US',
}));

const createTestStore = () =>
  configureStore({
    reducer: { users: userReducer },
    preloadedState: {
      users: {
        users: mockUsers,
        filteredUsers: mockUsers,
        isLoading: false,
        error: null,
        pageIndex: 0,
        pageSize: 15,
        sorting: [],
        filters: { search: '', gender: '', country: '' },
        rowOrder: mockUsers.map((u) => u.id),
      },
    },
  });

const createQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const TestWrapper: React.FC<{ 
  children: React.ReactNode;
  store?: ReturnType<typeof createTestStore>;
}> = ({ children, store = createTestStore() }) => (
  <Provider store={store}>
    <QueryClientProvider client={createQueryClient()}>
      <TableProvider>{children}</TableProvider>
    </QueryClientProvider>
  </Provider>
);

describe('UserTable', () => {
  it('renders table with headers', () => {
    render(
      <TestWrapper>
        <UserTable />
      </TestWrapper>
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Gender')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Country')).toBeInTheDocument();
  });

  it('displays user data', () => {
    render(
      <TestWrapper>
        <UserTable />
      </TestWrapper>
    );

    expect(screen.getByText('FirstName1 LastName1')).toBeInTheDocument();
    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
  });

  it('shows empty state when no users', () => {
    const emptyStore = configureStore({
      reducer: { users: userReducer },
      preloadedState: {
        users: {
          users: [],
          filteredUsers: [],
          isLoading: false,
          error: null,
          pageIndex: 0,
          pageSize: 15,
          sorting: [],
          filters: { search: '', gender: '', country: '' },
          rowOrder: [],
        },
      },
    });

    render(
      <TestWrapper store={emptyStore}>
        <UserTable />
      </TestWrapper>
    );

    expect(screen.getByText('No users found')).toBeInTheDocument();
  });
});

describe('SearchBar', () => {
  it('renders search input', () => {
    render(
      <TestWrapper>
        <SearchBar />
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText('Search by name or email...')).toBeInTheDocument();
  });

  it('updates on input', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <SearchBar />
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText('Search by name or email...');
    await user.type(input, 'John');
    expect(input).toHaveValue('John');
  });

  it('shows clear button when has value', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <SearchBar />
      </TestWrapper>
    );

    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('Search by name or email...'), 'test');
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
  });

  it('clears input on clear button click', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <SearchBar />
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText('Search by name or email...');
    await user.type(input, 'test');
    await user.click(screen.getByLabelText('Clear search'));
    expect(input).toHaveValue('');
  });
});

describe('Pagination', () => {
  it('renders pagination controls', () => {
    render(
      <TestWrapper>
        <Pagination />
      </TestWrapper>
    );

    expect(screen.getByLabelText('First page')).toBeInTheDocument();
    expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Next page')).toBeInTheDocument();
    expect(screen.getByLabelText('Last page')).toBeInTheDocument();
  });

  it('shows correct count', () => {
    render(
      <TestWrapper>
        <Pagination />
      </TestWrapper>
    );

    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('disables previous on first page', () => {
    render(
      <TestWrapper>
        <Pagination />
      </TestWrapper>
    );

    expect(screen.getByLabelText('First page')).toBeDisabled();
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('enables next when not on last page', () => {
    render(
      <TestWrapper>
        <Pagination />
      </TestWrapper>
    );

    expect(screen.getByLabelText('Next page')).not.toBeDisabled();
    expect(screen.getByLabelText('Last page')).not.toBeDisabled();
  });
});

describe('Redux State', () => {
  it('filters by search', () => {
    const store = createTestStore();
    store.dispatch({ type: 'users/setSearch', payload: 'FirstName1' });

    const { filters, filteredUsers } = store.getState().users;
    expect(filters.search).toBe('FirstName1');
    expect(filteredUsers.length).toBeLessThan(mockUsers.length);
  });

  it('filters by gender', () => {
    const store = createTestStore();
    store.dispatch({ type: 'users/setGenderFilter', payload: 'male' });

    const { filters, filteredUsers } = store.getState().users;
    expect(filters.gender).toBe('male');
    expect(filteredUsers.every((u) => u.gender === 'male')).toBe(true);
  });

  it('clears filters', () => {
    const store = createTestStore();
    store.dispatch({ type: 'users/setSearch', payload: 'test' });
    store.dispatch({ type: 'users/setGenderFilter', payload: 'male' });
    store.dispatch({ type: 'users/clearFilters' });

    const { filters, filteredUsers } = store.getState().users;
    expect(filters.search).toBe('');
    expect(filters.gender).toBe('');
    expect(filteredUsers.length).toBe(mockUsers.length);
  });

  it('resets page on filter', () => {
    const store = createTestStore();
    store.dispatch({ type: 'users/setPageIndex', payload: 2 });
    store.dispatch({ type: 'users/setSearch', payload: 'test' });

    expect(store.getState().users.pageIndex).toBe(0);
  });
});