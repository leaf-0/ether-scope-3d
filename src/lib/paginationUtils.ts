
/**
 * Generates an array of page numbers and ellipsis indicators
 * for pagination UI rendering.
 */
export const generatePageNumbers = (
  currentPage: number,
  totalPages: number,
  maxPagesToShow: number = 5
): (number | 'ellipsis-start' | 'ellipsis-end')[] => {
  const pageNumbers: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];
  
  if (totalPages <= maxPagesToShow) {
    // If we have fewer pages than the max, show all pages
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Always show first page
    pageNumbers.push(1);
    
    // Calculate start and end of the page range to show
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);
    
    // Adjust range for edge cases
    if (currentPage <= 2) {
      end = 3;
    } else if (currentPage >= totalPages - 1) {
      start = totalPages - 2;
    }
    
    // Add ellipsis before the range if needed
    if (start > 2) {
      pageNumbers.push('ellipsis-start');
    }
    
    // Add the range of pages
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }
    
    // Add ellipsis after the range if needed
    if (end < totalPages - 1) {
      pageNumbers.push('ellipsis-end');
    }
    
    // Always show last page if we have more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
  }
  
  return pageNumbers;
};

/**
 * Calculates pagination slice indices
 */
export const getPaginationSlice = (
  currentPage: number,
  itemsPerPage: number
): { startIndex: number; endIndex: number } => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return { startIndex, endIndex };
};
