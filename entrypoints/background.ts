import { getStoredAuthToken, saveAuthToken } from '../utils/auth';
import { EXTENSION_AUTH_MESSAGE_TYPE, type ExternalAuthMessage } from '../utils/messages';

const ALLOWED_AUTH_ORIGINS = new Set(['https://conozco.net', 'http://localhost:8000']);

function isAllowedAuthOrigin(origin: string | undefined): boolean {
  if (!origin) {
    return false;
  }

  return ALLOWED_AUTH_ORIGINS.has(origin);
}

export default defineBackground(() => {
  browser.runtime.onMessageExternal.addListener(
    (message: ExternalAuthMessage, sender, sendResponse) => {
      if (!isAllowedAuthOrigin(sender.origin)) {
        sendResponse({ success: false, error: 'Forbidden origin' });
        return;
      }

      if (message?.type !== EXTENSION_AUTH_MESSAGE_TYPE || !message.token) {
        sendResponse({ success: false, error: 'Invalid message' });
        return;
      }

      saveAuthToken(message.token)
        .then(() => {
          sendResponse({ success: true });
        })
        .catch((error) => {
          console.error('Failed to save auth token:', error);
          sendResponse({ success: false, error: 'Failed to save token' });
        });

      return true;
    },
  );

  browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === 'GET_AUTH_STATE') {
      getStoredAuthToken()
        .then((token) => {
          sendResponse({ authenticated: Boolean(token) });
        })
        .catch(() => {
          sendResponse({ authenticated: false });
        });
      return true;
    }

    return undefined;
  });
});
