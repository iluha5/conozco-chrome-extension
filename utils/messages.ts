export const AUTH_TOKEN_STORAGE_KEY = 'conozco_auth_token';

export const EXTENSION_AUTH_MESSAGE_TYPE = 'AUTH_TOKEN';

export type ExternalAuthMessage = {
  type: typeof EXTENSION_AUTH_MESSAGE_TYPE;
  token: string;
};

export type ExtensionProfile = {
  id: number;
  email: string;
  name: string | null;
  hasConfigured: boolean;
  ownLanguage: { id: number; code: string; name: string } | null;
  learnLanguage: { id: number; code: string; name: string } | null;
  interfaceLanguage: { id: number; code: string; name: string } | null;
};

export type QuickAddResponse = {
  word: string;
  translation: string | null;
  alreadyInDictionary: boolean;
  alreadyInUserWords: boolean;
  createdInDictionary: boolean;
  examplesCount: number;
  userWordId?: number;
};

export const QUICK_ADD_MESSAGE_TYPE = 'QUICK_ADD';
export const GET_AUTH_STATE_MESSAGE_TYPE = 'GET_AUTH_STATE';

export type QuickAddMessage = {
  type: typeof QUICK_ADD_MESSAGE_TYPE;
  word: string;
};

export type GetAuthStateMessage = {
  type: typeof GET_AUTH_STATE_MESSAGE_TYPE;
};

export type QuickAddMessageResponse =
  | { success: true; data: QuickAddResponse }
  | { success: false; error: string; needsAuth?: boolean };

export type GetAuthStateMessageResponse = {
  authenticated: boolean;
};
