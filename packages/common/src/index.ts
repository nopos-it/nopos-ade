/**
 * @nopos-ade/common
 * Shared types, validators, and XML builders
 */

// Export all types
export * from './types/common';
export * from './types/pem';
export * from './types/pel';
export * from './types/corrispettivi';
export * from './types/dc';
export * from './types/journal';
export * from './types/lottery';

// Export XML builders
export * from './builders/xml.builder';
export type { AnomalyReport } from './builders/xml.builder';

// Export validators
export * from './validators';

// Export utilities
export * from './utils/helpers';

export const VERSION = '1.0.0';
export const SPECIFICATIONS_VERSION = '1.1';
