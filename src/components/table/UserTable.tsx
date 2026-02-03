import React, { useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useDispatch } from 'react-redux';
import { User } from '../../types/user.types';
import { useUserState } from '../../hooks/useUsers';
import { useTableContext } from '../../context/TableContext';
import { setSorting, reorderRows } from '../../store/userSlice';
import { paginateData } from '../../utils/tableHelper';
import DraggableRow from './DraggableRow';
import TableHeader from './TableHeader';
import Pagination from '../Pagination/Pagination';

const EmptyState = () => (
  <div className="text-center py-16">
    <svg
      className="mx-auto h-16 w-16 text-gray-300"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
    <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
    <p className="mt-2 text-sm text-gray-500">
      Try adjusting your search or filter criteria.
    </p>
  </div>
);

const UserTable: React.FC = () => {
  const dispatch = useDispatch();
  const { filteredUsers, pageIndex, pageSize, sorting } = useUserState();
  const { setSorting: setContextSorting, setIsDragging } = useTableContext();

  // Column definitions

const columns = useMemo<ColumnDef<User>[]>(
  () => [
    {
      accessorKey: 'fullName', // Combined Picture + Name
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img
            src={row.original.picture}
            alt=""
            className="w-10 h-10 rounded-full object-cover bg-gray-100" // Standard avatar size
            loading="lazy"
          />
          <span className="font-semibold text-gray-900">
            {row.original.fullName}
          </span>
        </div>
      ),
      size: 250,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <span className="text-gray-500">{row.original.email}</span>
      ),
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }) => (
        // Plain text, Title Case
        <span className="text-gray-900 capitalize">
          {row.original.gender}
        </span>
      ),
      size: 100,
    },
    {
      accessorKey: 'country',
      header: 'Country',
      cell: ({ row }) => (
         <span className="text-gray-900">{row.original.country}</span>
      ),
    },
    {
      accessorKey: 'age',
      header: 'Age',
      cell: ({ row }) => (
        <span className="text-gray-900">{row.original.age}</span>
      ),
      size: 80,
    },
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: () => (
        <button className="text-gray-400 hover:text-gray-600 p-1">
          {/* Vertical Dots Icon */}
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      ),
      size: 80,
    },
  ],
  []
);
  // Paginated data
  const paginatedData = useMemo(
    () => paginateData(filteredUsers, pageIndex, pageSize),
    [filteredUsers, pageIndex, pageSize]
  );

  // Row IDs for DnD
  const rowIds = useMemo(() => paginatedData.map((row) => row.id), [paginatedData]);

  // DnD sensors
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
    useSensor(KeyboardSensor)
  );

  // Sorting handler
  const handleSortingChange = useCallback(
    (updater: SortingState | ((old: SortingState) => SortingState)) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
      dispatch(setSorting(newSorting));
      setContextSorting(newSorting);
    },
    [dispatch, setContextSorting, sorting]
  );

  // Table instance
  const table = useReactTable({
    data: paginatedData,
    columns,
    state: { sorting },
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(filteredUsers.length / pageSize),
  });

  // Drag handlers
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, [setIsDragging]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setIsDragging(false);
      const { active, over } = event;

      if (over && active.id !== over.id) {
        dispatch(
          reorderRows({
            activeId: active.id as string,
            overId: over.id as string,
          })
        );
      }
    },
    [dispatch, setIsDragging]
  );

  if (filteredUsers.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="card table-container scrollbar-thin">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <table className="table w-full">
            <TableHeader headerGroups={table.getHeaderGroups()} rowIds={rowIds} />
            <tbody className="table-body">
              <SortableContext items={rowIds} strategy={verticalListSortingStrategy}>
                {table.getRowModel().rows.map((row) => (
                  <DraggableRow key={row.id} row={row} />
                ))}
              </SortableContext>
            </tbody>
          </table>
        </DndContext>
      </div>
      <Pagination />
    </div>
  );
};

export default UserTable;