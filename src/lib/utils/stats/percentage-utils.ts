/**
 * Calculates a percentage with proper bounds checking and rounding
 * @param value The numerator value
 * @param total The denominator value
 * @param defaultValue Optional default value if total is 0 (defaults to 0)
 * @returns A number between 0 and 100
 */
export function calculatePercentage(value: number, total: number, defaultValue = 0): number {
  if (total === 0) return defaultValue;
  if (value === 0) return 0;
  
  // Ensure we're working with positive numbers
  const absValue = Math.abs(value);
  const absTotal = Math.abs(total);
  
  // Calculate percentage and clamp between 0 and 100
  return Math.min(Math.max(Math.round((absValue / absTotal) * 100), 0), 100);
}

/**
 * Calculates the month-over-month growth percentage
 * @param current Current period value
 * @param previous Previous period value
 * @returns Object containing the percentage value and whether it's positive
 */
export function calculateGrowthPercentage(current: number, previous: number): { value: number; isPositive: boolean } {
  if (previous === 0) {
    return { value: current > 0 ? 100 : 0, isPositive: current > 0 };
  }

  const percentageChange = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(Math.round(percentageChange)),
    isPositive: percentageChange >= 0
  };
}