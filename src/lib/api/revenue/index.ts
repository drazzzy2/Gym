export * from './types';
export * from './queries';

// Re-export the main function with a more consistent name
export { calculateRevenueStats as getRevenueStats } from './queries';