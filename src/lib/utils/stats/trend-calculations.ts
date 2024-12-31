interface TrendResult {
  value: number;
  isPositive: boolean;
}

export function calculateTrend(current: number, previous: number): TrendResult {
  if (previous === 0) return { value: 100, isPositive: true };
  const change = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(Math.round(change)),
    isPositive: change >= 0
  };
}

export function calculatePercentage(value: number, total: number, defaultValue = 100): number {
  if (total === 0) return defaultValue;
  return Math.min(Math.round((value / total) * 100), 100);
}