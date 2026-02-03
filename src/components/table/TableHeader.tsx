import React from 'react';
import { HeaderGroup, flexRender } from '@tanstack/react-table';
import { User } from '../../types/user.types';
import { useTableContext } from '../../context/TableContext';

interface TableHeaderProps {
  headerGroups: HeaderGroup<User>[];
  rowIds: string[];
}

const SortAscIcon = () => (
  <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

const SortDescIcon = () => (
  <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const SortIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
  </svg>
);


const TableHeader: React.FC<TableHeaderProps> = ({ headerGroups }) => {
  return (
    <thead className="bg-white border-b border-gray-200">
      {headerGroups.map((headerGroup) => (
        <tr key={headerGroup.id}>
          {/* Drag Spacer (Keeps alignment with rows) */}
          <th className="w-12 px-4 py-3 bg-white"></th>
          
          {/* Removed Selection Checkbox <th> */}

          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 
                ${header.column.getCanSort() ? 'cursor-pointer hover:bg-gray-50' : ''}`}
              onClick={header.column.getToggleSortingHandler()}
              style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
            >
              <div className="flex items-center gap-2">
                {flexRender(header.column.columnDef.header, header.getContext())}
                
                {header.column.getCanSort() && (
                  <span className="text-gray-400">
                    {/* Simple Sort Arrows */}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </span>
                )}
              </div>
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
};
export default TableHeader;