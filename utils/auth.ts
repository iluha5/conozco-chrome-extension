import { AUTH_TOKEN_STORAGE_KEY } from './messages';

export async function getStoredAuthToken(): Promise<string | null> {
  const result = await browser.storage.local.get(AUTH_TOKEN_STORAGE_KEY);
  const token = result[AUTH_TOKEN_STORAGE_KEY];

  return typeof token === 'string' && token.length > 0 ? token : null;
}

export async function saveAuthToken(token: string): Promise<void> {
  await browser.storage.local.set({ [AUTH_TOKEN_STORAGE_KEY]: token });
}

export async function clearAuthToken(): Promise<void> {
  await browser.storage.local.remove(AUTH_TOKEN_STORAGE_KEY);
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getStoredAuthToken();
  return token !== null;
}
