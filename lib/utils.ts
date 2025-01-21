import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseUrl() {
  // Browser should use relative url
  if (typeof window !== 'undefined') {
    return '';
  }
  
  // SSR should use Netlify URL
  if (process.env.NETLIFY === 'true') {
    return process.env.URL || 'https://moqaio.netlify.app';
  }

  // dev SSR should use localhost
  return `http://localhost:${process.env.PORT || 3001}`;
}