// src/context/TableContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { SortingState, ColumnFiltersState } from '@tanstack/react-table';
import { DensityType } from '../types/user.types';

interface TableContextType {
  // Column visibility
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  toggleColumn: (columnId: string) => void;
  
  // Density
  density: DensityType;
  setDensity: React.Dispatch<React.SetStateAction<DensityType>>;
  getRowPadding: () => string;
  
  // Sorting
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  
  // Column filters
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  
  // UI state
  isFilterPanelOpen: boolean;
  toggleFilterPanel: () => void;
  
  // Drag state
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Selection
  selectedRows: Set<string>;
  toggleRowSelection: (id: string) => void;
  selectAllRows: (ids: string[]) => void;
  clearSelection: () => void;
  isAllSelected: (ids: string[]) => boolean;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

const defaultColumnVisibility: Record<string, boolean> = {
  picture: true,
  fullName: true,
  email: true,
  gender: true,
  age: true,
  country: true,
  phone: true,
};

export const TableProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // States
  const [columnVisibility, setColumnVisibility] = useState(defaultColumnVisibility);
  const [density, setDensity] = useState<DensityType>('normal');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Column visibility toggle
  const toggleColumn = useCallback((columnId: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  }, []);

  // Get row padding based on density
  const getRowPadding = useCallback(() => {
    const paddingMap: Record<DensityType, string> = {
      compact: 'py-1',
      normal: 'py-2.5',
      comfortable: 'py-4',
    };
    return paddingMap[density];
  }, [density]);

  // Filter panel toggle
  const toggleFilterPanel = useCallback(() => {
    setIsFilterPanelOpen((prev) => !prev);
  }, []);

  // Row selection handlers
  const toggleRowSelection = useCallback((id: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const selectAllRows = useCallback((ids: string[]) => {
    setSelectedRows((prev) => {
      const allSelected = ids.every((id) => prev.has(id));
      return allSelected ? new Set() : new Set(ids);
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedRows(new Set());
  }, []);

  const isAllSelected = useCallback(
    (ids: string[]) => {
      return ids.length > 0 && ids.every((id) => selectedRows.has(id));
    },
    [selectedRows]
  );

  const value = useMemo(
    () => ({
      columnVisibility,
      setColumnVisibility,
      toggleColumn,
      density,
      setDensity,
      getRowPadding,
      sorting,
      setSorting,
      columnFilters,
      setColumnFilters,
      isFilterPanelOpen,
      toggleFilterPanel,
      isDragging,
      setIsDragging,
      selectedRows,
      toggleRowSelection,
      selectAllRows,
      clearSelection,
      isAllSelected,
    }),
    [
      columnVisibility,
      toggleColumn,
      density,
      getRowPadding,
      sorting,
      columnFilters,
      isFilterPanelOpen,
      toggleFilterPanel,
      isDragging,
      selectedRows,
      toggleRowSelection,
      selectAllRows,
      clearSelection,
      isAllSelected,
    ]
  );

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
};

export const useTableContext = (): TableContextType => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTableContext must be used within a TableProvider');
  }
  return context;
};