import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge Tailwind classes, resolving conflicts safely.
 * Placed in the presentation layer as it strictly handles UI/styling concerns.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
