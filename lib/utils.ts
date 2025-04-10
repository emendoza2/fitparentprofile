import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a dimension ID (like "TRUTH-SEEKING") to a properly cased title (like "Truth-Seeking")
 */
export function properCase(dimension: string): string {
  return dimension
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('-');
}

/**
 * Converts a dimension ID (like "TRUTH-SEEKING") to a title case (like "Truth Seeking")
 */
export function titleCase(dimension: string): string {
  return dimension
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
