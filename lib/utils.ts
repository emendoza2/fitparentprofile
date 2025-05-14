import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a dimension ID (like "TRUTH-SEEKING") to a properly cased title (like "Truth-Seeking")
 */
export function properCase(dimension: string): string {
  return dimension
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("-");
}

/**
 * Converts a dimension ID (like "TRUTH-SEEKING") to a title case (like "Truth Seeking")
 */
export function titleCase(dimension: string): string {
  return dimension
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Maps the values of an object using a function
 */
export function mapObjectValues<T, U>(
  obj: Record<string, T>,
  fn: (value: T, key: string) => U
): Record<string, U> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, fn(value, key)])
  );
}
