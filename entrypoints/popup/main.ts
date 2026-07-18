import './style.css';
import { fetchExtensionProfile } from '../../utils/api';
import { clearAuthToken, getStoredAuthToken } from '../../utils/auth';
import { AUTH_CONNECT_URL, CONOZCO_WORDS_URL } from '../../utils/config';
import type { ExtensionProfile } from '../../utils/messages';

type PopupState =
  | { status: 'loading' }
  | { status: 'guest' }
  | { status: 'authenticated'; profile: ExtensionProfile }
  | { status: 'error'; message: string };

const appElement = document.querySelector<HTMLDivElement>('#app');

function renderState(state: PopupState) {
  if (!appElement) {
    return;
  }

  if (state.status === 'loading') {
    appElement.innerHTML = `
      <div class="popup">
        <h1>Conozco</h1>
        <div class="loading" aria-live="polite" aria-busy="true">
          <div class="spinner" aria-hidden="true"></div>
          <p class="muted">Loading...</p>
        </div>
      </div>
    `;
    return;
  }

  if (state.status === 'guest') {
    appElement.innerHTML = `
      <div class="popup">
        <h1>Conozco</h1>
        <p class="muted">Sign in to add words from any webpage.</p>
        <button id="sign-in-button" type="button" class="primary-button">Sign in to Conozco</button>
      </div>
    `;

    const signInButton = document.querySelector<HTMLButtonElement>('#sign-in-button');
    signInButton?.addEventListener('click', handleSignInClick);
    return;
  }

  if (state.status === 'error') {
    appElement.innerHTML = `
      <div class="popup">
        <h1>Conozco</h1>
        <p class="error">${state.message}</p>
        <button id="retry-button" type="button" class="primary-button">Retry</button>
        <button id="sign-out-button" type="button" class="secondary-button">Sign out</button>
      </div>
    `;

    document
      .querySelector<HTMLButtonElement>('#retry-button')
      ?.addEventListener('click', handleRetryClick);
    document
      .querySelector<HTMLButtonElement>('#sign-out-button')
      ?.addEventListener('click', handleSignOutClick);
    return;
  }

  const learnLanguage = state.profile.learnLanguage?.code?.toUpperCase() ?? '—';

  appElement.innerHTML = `
    <div class="popup">
      <h1>Conozco</h1>
      <p class="email">${state.profile.email}</p>
      <p class="muted">Learning: <strong>${learnLanguage}</strong></p>
      <a href="${CONOZCO_WORDS_URL}" target="_blank" class="link-button">Open my words</a>
      <button id="sign-out-button" type="button" class="secondary-button">Sign out</button>
    </div>
  `;

  document
    .querySelector<HTMLButtonElement>('#sign-out-button')
    ?.addEventListener('click', handleSignOutClick);
}

function handleSignInClick() {
  browser.tabs.create({ url: AUTH_CONNECT_URL });
}

async function handleSignOutClick() {
  await clearAuthToken();
  renderState({ status: 'guest' });
}

function handleRetryClick() {
  void initializePopup();
}

async function initializePopup() {
  renderState({ status: 'loading' });

  const token = await getStoredAuthToken();

  if (!token) {
    renderState({ status: 'guest' });
    return;
  }

  try {
    const profile = await fetchExtensionProfile();
    renderState({ status: 'authenticated', profile });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load profile';
    renderState({ status: 'error', message });
  }
}

void initializePopup();
