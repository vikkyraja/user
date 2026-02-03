// src/components/Filters/FilterDropdown.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { setGenderFilter, setCountryFilter } from '../../store/userSlice';
import { useUserState } from '../../hooks/useUsers';
import { capitalizeFirst } from '../../utils/tableHelper';

interface FilterDropdownProps {
  countries: string[];
  genders: string[];
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ countries, genders }) => {
  const dispatch = useDispatch();
  const { filters } = useUserState();

  return (
    <div className="flex flex-row gap-3">
      {/* Gender Dropdown */}
      <div className="w-40">
        <select
          value={filters.gender}
          onChange={(e) => dispatch(setGenderFilter(e.target.value))}
          className="select h-full cursor-pointer"
          aria-label="Filter by gender"
        >
          <option value="">All Genders</option>
          {genders.map((gender) => (
            <option key={gender} value={gender}>
              {capitalizeFirst(gender)}
            </option>
          ))}
        </select>
      </div>

      {/* Country Dropdown */}
      <div className="w-48">
        <select
          value={filters.country}
          onChange={(e) => dispatch(setCountryFilter(e.target.value))}
          className="select h-full cursor-pointer"
          aria-label="Filter by country"
        >
          <option value="">All Countries</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterDropdown;