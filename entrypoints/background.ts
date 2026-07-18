import { quickAddWord } from '../utils/api';
import { getStoredAuthToken, saveAuthToken } from '../utils/auth';
import {
  EXTENSION_AUTH_MESSAGE_TYPE,
  type ExternalAuthMessage,
  GET_AUTH_STATE_MESSAGE_TYPE,
  type GetAuthStateMessage,
  QUICK_ADD_MESSAGE_TYPE,
  type QuickAddMessage,
  type QuickAddMessageResponse,
} from '../utils/messages';

const ALLOWED_AUTH_ORIGINS = new Set([
  'https://conozco.net',
  ...(import.meta.env.DEV ? ['http://localhost:8000'] : []),
]);

function isAllowedAuthOrigin(origin: string | undefined): boolean {
  if (!origin) {
    return false;
  }

  return ALLOWED_AUTH_ORIGINS.has(origin);
}

function isQuickAddMessage(message: unknown): message is QuickAddMessage {
  return (
    typeof message === 'object' &&
    message !== null &&
    'type' in message &&
    message.type === QUICK_ADD_MESSAGE_TYPE &&
    'word' in message &&
    typeof message.word === 'string'
  );
}

function isGetAuthStateMessage(message: unknown): message is GetAuthStateMessage {
  return (
    typeof message === 'object' &&
    message !== null &&
    'type' in message &&
    message.type === GET_AUTH_STATE_MESSAGE_TYPE
  );
}

async function handleQuickAdd(word: string): Promise<QuickAddMessageResponse> {
  const token = await getStoredAuthToken();

  if (!token) {
    return {
      success: false,
      error: 'Not authenticated',
      needsAuth: true,
    };
  }

  try {
    const data = await quickAddWord(word);
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to add word';
    return { success: false, error: message };
  }
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
    if (isGetAuthStateMessage(message)) {
      getStoredAuthToken()
        .then((token) => {
          sendResponse({ authenticated: Boolean(token) });
        })
        .catch(() => {
          sendResponse({ authenticated: false });
        });
      return true;
    }

    if (isQuickAddMessage(message)) {
      handleQuickAdd(message.word)
        .then((response) => {
          sendResponse(response);
        })
        .catch((error) => {
          console.error('Quick add handler error:', error);
          sendResponse({
            success: false,
            error: 'Failed to add word',
          });
        });
      return true;
    }

    return undefined;
  });
});
