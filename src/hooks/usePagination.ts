
import { useState, useEffect } from 'react';

interface PaginationOptions<T> {
  data: T[];
  itemsPerPage: number;
  initialPage?: number;
}

interface PaginationResult<T> {
  currentItems: T[];
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
}

export function usePagination<T>({
  data,
  itemsPerPage,
  initialPage = 1
}: PaginationOptions<T>): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  // Reset to page 1 if data length changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);
  
  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
  
  // Ensure currentPage is valid if totalPages changes
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);
  
  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  
  // Page navigation functions
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);
  const firstPage = () => goToPage(1);
  const lastPage = () => goToPage(totalPages);
  
  return {
    currentItems,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage
  };
}
