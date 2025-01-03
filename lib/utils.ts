import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSiteURL() {
  // In production, use the NEXT_PUBLIC_SITE_URL environment variable
  // In development, use the current window location
  return process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
}