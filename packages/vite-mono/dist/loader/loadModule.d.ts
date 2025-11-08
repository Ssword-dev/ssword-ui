/**
 * Find the first file that matches the given pattern(s) under `root` and load it
 * using the appropriate loader based on file extension.
 * Returns the loaded configuration or null when none found.
 */
export declare function loadModule<CT>(root: string, pattern: string | string[]): Promise<CT | null>;
