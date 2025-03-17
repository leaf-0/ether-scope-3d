
/**
 * Formats a wallet address by truncating the middle section
 * @param address - The Ethereum address to format
 * @param prefixLength - Number of characters to show at the beginning
 * @param suffixLength - Number of characters to show at the end
 */
export const formatAddress = (
  address: string,
  prefixLength: number = 6,
  suffixLength: number = 4
): string => {
  if (!address) return '';
  if (address.length <= prefixLength + suffixLength) return address;
  
  return `${address.substring(0, prefixLength)}...${address.substring(
    address.length - suffixLength
  )}`;
};

/**
 * Formats an Ethereum value to a readable string with ETH
 * @param value - The value to format (as string or number)
 * @param decimals - Number of decimal places to show
 */
export const formatEthValue = (
  value: string | number,
  decimals: number = 6
): string => {
  if (!value) return '0 ETH';
  const valueNum = typeof value === 'string' ? parseFloat(value) : value;
  
  // Handle different ranges with appropriate formatting
  if (valueNum >= 1000) {
    return `${valueNum.toFixed(2)} ETH`;
  } else if (valueNum >= 1) {
    return `${valueNum.toFixed(4)} ETH`;
  } else {
    return `${valueNum.toFixed(decimals)} ETH`;
  }
};

/**
 * Formats a date object or string to a human-readable string
 * @param date - The date to format
 * @param includeTime - Whether to include the time
 */
export const formatDate = (
  date: Date | string | undefined,
  includeTime: boolean = true
): string => {
  if (!date) return 'Unknown';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Invalid date';
  
  if (includeTime) {
    return dateObj.toLocaleString();
  }
  return dateObj.toLocaleDateString();
};

/**
 * Formats a timestamp to a relative time (e.g., "5 minutes ago")
 * @param date - The date to format
 */
export const formatTimeAgo = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((new Date().getTime() - dateObj.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  
  const years = Math.floor(months / 12);
  return `${years}y ago`;
};

/**
 * Gets a color based on risk score
 * @param score - Risk score (0-100)
 */
export const getRiskColor = (score: number): string => {
  if (score < 30) return 'green';
  if (score < 70) return 'amber';
  return 'rose';
};
