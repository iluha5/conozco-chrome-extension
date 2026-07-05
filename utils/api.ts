import { getStoredAuthToken } from './auth';
import { API_BASE } from './config';
import type { ExtensionProfile, QuickAddResponse } from './messages';

type ApiErrorBody = {
  error?: string;
  retryAfter?: number;
};

async function extensionFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getStoredAuthToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init.headers ?? {}),
    },
  });

  const data = (await response.json().catch(() => ({}))) as T & ApiErrorBody;

  if (!response.ok) {
    const message = data.error || `Request failed (${response.status})`;
    const error = new Error(message) as Error & { retryAfter?: number };
    if (typeof data.retryAfter === 'number') {
      error.retryAfter = data.retryAfter;
    }
    throw error;
  }

  return data;
}

export async function fetchExtensionProfile(): Promise<ExtensionProfile> {
  return extensionFetch<ExtensionProfile>('/api/extension/me');
}

export async function quickAddWord(word: string): Promise<QuickAddResponse> {
  return extensionFetch<QuickAddResponse>('/api/extension/words/quick-add', {
    method: 'POST',
    body: JSON.stringify({ word }),
  });
}
