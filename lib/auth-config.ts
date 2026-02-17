export const getAuthConfig = () => {
  const origin = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://moqaio.netlify.app';

  return {
    redirectTo: `${origin}/auth/callback`,
  };
};