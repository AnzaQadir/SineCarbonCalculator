
/**
 * Format a number to 2 decimal places and add thousand separators
 * @param num The number to format
 * @returns Formatted number as string
 */
export const formatNumber = (num: number): string => {
  // Handle very small numbers to avoid scientific notation
  if (Math.abs(num) < 0.01 && num !== 0) {
    return '<0.01';
  }
  
  // Format with 2 decimal places and add thousand separators
  // If the decimals are .00, remove them for cleaner display
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(num);
  
  return formatted;
};
