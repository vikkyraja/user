// src/components/UserTable/DraggableRow.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Row, flexRender } from '@tanstack/react-table';
import { User } from '../../types/user.types';
import { useTableContext } from '../../context/TableContext';

interface DraggableRowProps {
  row: Row<User>;
}

const DragHandleIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
  </svg>
);

const DraggableRow: React.FC<DraggableRowProps> = ({ row }) => {
  const { getRowPadding, selectedRows, toggleRowSelection } = useTableContext();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.original.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: isDragging ? 'relative' : undefined,
    zIndex: isDragging ? 1 : undefined,
  };

  const isSelected = selectedRows.has(row.original.id);


return (
  <tr
    ref={setNodeRef}
    style={style}
    className={`
      group border-b border-gray-100 hover:bg-gray-50 transition-colors bg-white
      ${isDragging ? 'opacity-50 bg-gray-50' : ''}
    `}
  >
    {/* Drag Handle - Only shows generic grip icon */}
    <td className="w-12 px-4 py-4 text-center">
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-600 p-1"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </button>
    </td>

    {/* Removed Selection Checkbox <td> */}

    {/* Data Cells */}
    {row.getVisibleCells().map((cell) => (
      <td
        key={cell.id}
        className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap"
      >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </td>
    ))}
  </tr>
);
};

export default DraggableRow;