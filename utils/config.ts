declare const __API_BASE__: string;

export const API_BASE = typeof __API_BASE__ !== 'undefined' ? __API_BASE__ : 'https://conozco.net';

export const AUTH_CONNECT_URL = `${API_BASE}/auth/extension-connect`;

export const CONOZCO_WORDS_URL = `${API_BASE}/words`;
