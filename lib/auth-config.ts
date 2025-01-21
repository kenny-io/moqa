// export const getAuthConfig = () => {
//     const isProd = process.env.NODE_ENV === 'production';
//     const siteUrl = isProd 
//       ? process.env.NEXT_PUBLIC_SITE_URL 
//       : 'http://localhost:3001'; // Use your local dev port
  
//     return {
//       redirectTo: `${siteUrl}/auth/callback`,
//     };
//   };

import { headers } from 'next/headers';

export const getAuthConfig = () => {
  // Get the host from the request headers
  const headersList = headers();
  const host = headersList.get('host') || '';
  
  // Determine if we're in a production environment
  const isProd = !host.includes('localhost') && !host.includes('127.0.0.1');
  
  // Build the base URL
  const protocol = isProd ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;

  return {
    redirectTo: `${baseUrl}/auth/callback`,
  };
};