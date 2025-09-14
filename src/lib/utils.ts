import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string into a human-readable format
 * @param dateString - ISO date string (e.g., "2025-09-11")
 * @param dateFormat - Optional format string, defaults to "MMMM d, yyyy"
 * @returns formatted date or empty string if invalid
 */
export function formatDate(dateString: string, dateFormat = "MMMM d, yyyy") {
  if (!dateString) return "";
  try {
    return format(new Date(dateString), dateFormat);
  } catch {
    return "";
  }
}
