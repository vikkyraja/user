// src/components/Pagination/Pagination.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { setPageIndex, setPageSize } from '../../store/userSlice';
import { useUserState } from '../../hooks/useUsers';
import { getPageCount, formatNumber } from '../../utils/tableHelper';

const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ChevronDoubleLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
  </svg>
);

const ChevronDoubleRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
  </svg>
);

const Pagination: React.FC = () => {
  const dispatch = useDispatch();
  const { pageIndex, pageSize, filteredUsers } = useUserState();

  const totalItems = filteredUsers.length;
  const pageCount = getPageCount(totalItems, pageSize);
  const startItem = totalItems > 0 ? pageIndex * pageSize + 1 : 0;
  const endItem = Math.min((pageIndex + 1) * pageSize, totalItems);

  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;

  const getVisiblePages = (): (number | 'ellipsis')[] => {
    if (pageCount <= 7) {
      return Array.from({ length: pageCount }, (_, i) => i);
    }

    const pages: (number | 'ellipsis')[] = [];
    const delta = 2;

    for (let i = 0; i < pageCount; i++) {
      if (
        i === 0 ||
        i === pageCount - 1 ||
        (i >= pageIndex - delta && i <= pageIndex + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== 'ellipsis') {
        pages.push('ellipsis');
      }
    }

    return pages;
  };

  const NavButton: React.FC<{
    onClick: () => void;
    disabled: boolean;
    label: string;
    children: React.ReactNode;
  }> = ({ onClick, disabled, label, children }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      aria-label={label}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
      {/* Items info */}
      <div className="text-sm text-gray-600">
        Showing <span className="font-semibold text-gray-900">{formatNumber(startItem)}</span> to{' '}
        <span className="font-semibold text-gray-900">{formatNumber(endItem)}</span> of{' '}
        <span className="font-semibold text-gray-900">{formatNumber(totalItems)}</span> results
      </div>

      {/* Page size selector */}
      <div className="flex items-center gap-2">
        <label htmlFor="page-size" className="text-sm text-gray-600">
          Rows per page:
        </label>
        <select
          id="page-size"
          value={pageSize}
          onChange={(e) => dispatch(setPageSize(Number(e.target.value)))}
          className="select w-20 py-1.5"
        >
          {[10, 15, 20, 25, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-1" aria-label="Pagination">
        <NavButton
          onClick={() => dispatch(setPageIndex(0))}
          disabled={!canPreviousPage}
          label="First page"
        >
          <ChevronDoubleLeftIcon />
        </NavButton>

        <NavButton
          onClick={() => dispatch(setPageIndex(pageIndex - 1))}
          disabled={!canPreviousPage}
          label="Previous page"
        >
          <ChevronLeftIcon />
        </NavButton>

        {/* Page numbers (hidden on mobile) */}
        <div className="hidden sm:flex items-center gap-1">
          {getVisiblePages().map((page, idx) =>
            page === 'ellipsis' ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => dispatch(setPageIndex(page))}
                className={`min-w-[2.5rem] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  page === pageIndex
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                aria-current={page === pageIndex ? 'page' : undefined}
              >
                {page + 1}
              </button>
            )
          )}
        </div>

        {/* Mobile page indicator */}
        <span className="sm:hidden text-sm text-gray-600 px-2">
          {pageIndex + 1} / {pageCount}
        </span>

        <NavButton
          onClick={() => dispatch(setPageIndex(pageIndex + 1))}
          disabled={!canNextPage}
          label="Next page"
        >
          <ChevronRightIcon />
        </NavButton>

        <NavButton
          onClick={() => dispatch(setPageIndex(pageCount - 1))}
          disabled={!canNextPage}
          label="Last page"
        >
          <ChevronDoubleRightIcon />
        </NavButton>
      </nav>
    </div>
  );
};

export default Pagination;