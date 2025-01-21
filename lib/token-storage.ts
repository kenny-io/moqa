const TOKEN_PREFIX = 'webhook_token_';

export const TokenStorage = {
  // Save token to both cookie and localStorage for redundancy
  saveToken: (webhookId: string, token: string) => {
    // Save to localStorage
    localStorage.setItem(`${TOKEN_PREFIX}${webhookId}`, token);
    
    // Save to cookie (30 days expiry)
    document.cookie = `${TOKEN_PREFIX}${webhookId}=${token};path=/;max-age=2592000;SameSite=Strict`;
  },

  // Get token from either storage method
  getToken: (webhookId: string): string | null => {
    // Try localStorage first
    const localToken = localStorage.getItem(`${TOKEN_PREFIX}${webhookId}`);
    if (localToken) return localToken;

    // Try cookies if localStorage failed
    const cookieToken = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${TOKEN_PREFIX}${webhookId}`))
      ?.split('=')[1];

    return cookieToken || null;
  },

  // Remove token from both storage methods
  removeToken: (webhookId: string) => {
    // Remove from localStorage
    localStorage.removeItem(`${TOKEN_PREFIX}${webhookId}`);
    
    // Remove from cookies
    document.cookie = `${TOKEN_PREFIX}${webhookId}=;path=/;max-age=0`;
  }
}; 