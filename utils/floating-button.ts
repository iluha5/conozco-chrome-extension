import { AUTH_CONNECT_URL } from './config';
import type { QuickAddMessageResponse } from './messages';

export type FloatingButtonState = 'idle' | 'loading' | 'success' | 'error';

const BUTTON_SIZE = 32;
const BUTTON_OFFSET = 8;
const SUCCESS_VISIBLE_MS = 2000;
const ERROR_VISIBLE_MS = 3000;

export class FloatingAddButton {
  private host: HTMLDivElement;
  private shadowRoot: ShadowRoot;
  private button: HTMLButtonElement;
  private hideTimeoutId: number | null = null;

  constructor() {
    this.host = document.createElement('div');
    this.host.id = 'conozco-add-word-host';
    this.host.style.position = 'fixed';
    this.host.style.top = '0';
    this.host.style.left = '0';
    this.host.style.zIndex = '2147483647';
    this.host.style.display = 'none';

    this.shadowRoot = this.host.attachShadow({ mode: 'closed' });
    this.shadowRoot.innerHTML = `
      <style>
        button {
          all: initial;
          box-sizing: border-box;
          width: ${BUTTON_SIZE}px;
          height: ${BUTTON_SIZE}px;
          border-radius: 999px;
          border: none;
          background: #2563eb;
          color: #ffffff;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 18px;
          font-weight: 700;
          line-height: 1;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        button:hover {
          background: #1d4ed8;
        }

        button:disabled {
          cursor: wait;
          opacity: 0.85;
        }

        button.success {
          background: #16a34a;
          box-shadow: 0 4px 14px rgba(22, 163, 74, 0.45);
        }

        button.error {
          background: #dc2626;
          box-shadow: 0 4px 14px rgba(220, 38, 38, 0.45);
        }
      </style>
      <button type="button" title="Add to Conozco" aria-label="Add to Conozco">+</button>
    `;

    this.button = this.shadowRoot.querySelector('button') as HTMLButtonElement;
    document.documentElement.appendChild(this.host);
  }

  containsTarget(event: Event): boolean {
    return event.composedPath().includes(this.host);
  }

  showAt(rect: DOMRect) {
    this.clearHideTimeout();
    this.setState('idle');

    const top = Math.min(
      window.innerHeight - BUTTON_SIZE - BUTTON_OFFSET,
      rect.bottom + BUTTON_OFFSET,
    );
    const left = Math.min(
      window.innerWidth - BUTTON_SIZE - BUTTON_OFFSET,
      Math.max(BUTTON_OFFSET, rect.left + rect.width / 2 - BUTTON_SIZE / 2),
    );

    this.host.style.top = `${top}px`;
    this.host.style.left = `${left}px`;
    this.host.style.display = 'block';
  }

  hide() {
    this.clearHideTimeout();
    this.host.style.display = 'none';
    this.setState('idle');
  }

  setClickHandler(handler: () => void) {
    this.button.onclick = handler;
  }

  async handleQuickAdd(word: string) {
    this.setState('loading');

    try {
      const response = (await browser.runtime.sendMessage({
        type: 'QUICK_ADD',
        word,
      })) as QuickAddMessageResponse | undefined;

      if (!response) {
        throw new Error('No response from extension');
      }

      if (!response.success) {
        if (response.needsAuth) {
          await browser.tabs.create({ url: AUTH_CONNECT_URL });
          this.hide();
          return;
        }

        throw new Error(response.error);
      }

      const title = response.data.alreadyInUserWords
        ? `Already in your words: ${response.data.translation ?? response.data.word}`
        : `Added: ${response.data.translation ?? response.data.word}`;

      this.setState('success', title);
      this.scheduleHide(SUCCESS_VISIBLE_MS);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add word';
      this.setState('error', message);
      this.scheduleHide(ERROR_VISIBLE_MS);
    }
  }

  private setState(state: FloatingButtonState, title?: string) {
    this.button.disabled = state === 'loading';
    this.button.classList.remove('success', 'error');

    if (state === 'idle') {
      this.button.textContent = '+';
      this.button.title = 'Add to Conozco';
      return;
    }

    if (state === 'loading') {
      this.button.textContent = '…';
      this.button.title = 'Adding…';
      return;
    }

    if (state === 'success') {
      this.button.textContent = '✓';
      this.button.classList.add('success');
      this.button.title = title ?? 'Added';
      return;
    }

    this.button.textContent = '!';
    this.button.classList.add('error');
    this.button.title = title ?? 'Error';
  }

  private scheduleHide(delayMs: number) {
    this.clearHideTimeout();
    this.hideTimeoutId = window.setTimeout(() => {
      this.hide();
    }, delayMs);
  }

  private clearHideTimeout() {
    if (this.hideTimeoutId !== null) {
      window.clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
    }
  }
}
