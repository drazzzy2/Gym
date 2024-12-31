// Utility functions for calculating various statistics

export function calculateCapacityUtilization(activeMembers: number, totalCapacity: number): number {
  return Math.min(Math.round((activeMembers / totalCapacity) * 100), 100);
}

export function calculateRetentionRate(activeMembers: number[], totalMembers: number[]): number {
  if (totalMembers.length === 0) return 100;
  return Math.min(Math.round((activeMembers.length / totalMembers.length) * 100), 100);
}

export function calculateRenewalRate(renewedMembers: number, totalEligible: number): number {
  if (totalEligible === 0) return 100;
  return Math.min(Math.round((renewedMembers / totalEligible) * 100), 100);
}

export function calculateTrend(current: number, previous: number): { value: number; isPositive: boolean } {
  if (previous === 0) return { value: 0, isPositive: true };
  const percentageChange = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(Math.round(percentageChange)),
    isPositive: percentageChange >= 0
  };
}