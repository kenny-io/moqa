export const getAuthConfig = () => {
  const origin = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://usemoqa.xyz';

  return {
    redirectTo: `${origin}/auth/callback`,
  };
};