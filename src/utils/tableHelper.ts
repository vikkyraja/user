export const paginateData = <T>(
  data: T[],
  pageIndex: number,
  pageSize: number
): T[] => {
  const start = pageIndex * pageSize;
  return data.slice(start, start + pageSize);
};

export const getPageCount = (totalItems: number, pageSize: number): number => {
  return Math.ceil(totalItems / pageSize);
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};