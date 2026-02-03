import React from 'react';

interface CountrySearchProps {
  countries: string[];
  value: string | null;
  onChange: (value: string | undefined) => void;
}

export const CountrySearch = ({ countries, value, onChange }: CountrySearchProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
 
    onChange(selectedValue === '' ? undefined : selectedValue);
  };


  const sortedCountries = [...countries].sort((a, b) => a.localeCompare(b));
console.log('Sorted Countries:', countries, sortedCountries);
  return (
    <div className="relative">
      <select
        name="country"
        id="country-filter"
        value={value ?? ''}
        onChange={handleChange}
        className="flex h-10 w-full sm:w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer appearance-none"
        aria-label="Filter by country"
      >
        <option value="">All Countries</option>
        {sortedCountries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
      {/* Custom dropdown arrow */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
};

export default CountrySearch;