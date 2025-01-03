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

export function getBaseUrl() {
  // Check if we're in development environment
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }

  // For production environment
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Fallback for production if NEXT_PUBLIC_SITE_URL is not set
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return 'http://localhost:3000';
}