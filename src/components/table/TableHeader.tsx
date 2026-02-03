import React from 'react';
import { HeaderGroup, flexRender } from '@tanstack/react-table';
import { User } from '../../types/user.types';


interface TableHeaderProps {
  headerGroups: HeaderGroup<User>[];
  rowIds: string[];
}


const TableHeader: React.FC<TableHeaderProps> = ({ headerGroups }) => {
  return (
    <thead className="bg-white border-b border-gray-200">
      {headerGroups.map((headerGroup) => (
        <tr key={headerGroup.id}>
         
          <th className="w-12 px-4 py-3 bg-white"></th>
          
          

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