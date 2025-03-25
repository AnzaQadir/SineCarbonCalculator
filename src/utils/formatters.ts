
/**
 * Format a number to 2 decimal places and add thousand separators
 * @param num The number to format
 * @returns Formatted number as string
 */
export const formatNumber = (num: number): string => {
  return Number(num.toFixed(2)).toLocaleString();
};
