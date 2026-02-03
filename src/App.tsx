// src/App.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { useUsers, useUserState } from './hooks/useUsers';
import { clearFilters } from './store/userSlice';

import { useTableContext } from './context/TableContext';
import config from './config/env';
import Header from './components/layout/Header';
import { SearchBar, FilterDropdown } from './components/filters';
import UserTable from './components/table/UserTable';
import { DensityType } from './types/user.types';

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
    <div className="spinner-lg" />
    <p className="mt-4 text-gray-600 font-medium">Loading users...</p>
  </div>
);

const ErrorDisplay: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
  <div className="alert alert-error animate-fade-in">
    <div className="flex items-start gap-3">
      <svg className="h-6 w-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <h3 className="font-medium">Error loading data</h3>
        <p className="text-sm mt-1">{message}</p>
      </div>
    </div>
    <button onClick={onRetry} className="btn btn-primary mt-4">Try Again</button>
  </div>
);

const DensityToggle: React.FC<{ density: DensityType; onChange: (d: DensityType) => void }> = ({ density, onChange }) => (
  <div className="flex items-center bg-gray-100 rounded-lg p-1">
    {(['compact', 'normal', 'comfortable'] as const).map((d) => (
      <button
        key={d}
        onClick={() => onChange(d)}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${density === d ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
      >
        {d.charAt(0).toUpperCase() + d.slice(1)}
      </button>
    ))}
  </div>
);

const App: React.FC = () => {
  
  const { isLoading, isError, error, countries, genders, refetch } = useUsers();


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title={'User Directory'} />



      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {isLoading && <LoadingSpinner />}
        {isError && <ErrorDisplay message={error?.message || 'Failed'} onRetry={() => refetch()} />}

        {!isLoading && !isError && (
          <div className="space-y-6">

            {/* CLEAN TOOLBAR */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search - Takes all available space */}
              <div className="flex-1">
                <SearchBar placeholder="Search by name or email..." />
              </div>

              {/* Filters - Sits on the right */}
              <div className="flex-shrink-0">
                <FilterDropdown countries={countries} genders={genders} />
              </div>
            </div>


            {/* Table Card - Added border, removed shadow for flat look */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <UserTable />
            </div>

            {/* Result Count (Optional, usually inside pagination but keeping it here if needed) */}
            <div className="hidden">
              {/* Hiding the top counter as it's shown in pagination bottom left in screenshot */}
            </div>
          </div>
        )}
      </main>
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          {config.app.name} v{config.app.version}
        </div>
      </footer>
    </div>
  );
};

export default App;