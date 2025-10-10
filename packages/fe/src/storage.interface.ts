/**
 * Storage Interface
 * Abstract interface for storing and retrieving FatturaPA files
 *
 * Uses Uint8Array for browser compatibility (works in both Node.js and browsers)
 */

export interface IStorage {
  /**
   * Store a file
   */
  store(path: string, data: string | Uint8Array, metadata?: Record<string, string>): Promise<void>;

  /**
   * Retrieve a file
   * @returns File content or null if not found
   */
  retrieve(path: string): Promise<Uint8Array | null>;

  /**
   * Check if file exists
   */
  exists(path: string): Promise<boolean>;

  /**
   * Delete a file
   */
  delete(path: string): Promise<void>;

  /**
   * List files with prefix
   */
  list(prefix: string): Promise<string[]>;

  /**
   * Get file metadata
   */
  getMetadata(path: string): Promise<Record<string, string> | null>;

  /**
   * Create a directory (if supported by implementation)
   */
  createDirectory?(path: string): Promise<void>;

  /**
   * Check if directory exists (if supported by implementation)
   */
  directoryExists?(path: string): Promise<boolean>;
}
