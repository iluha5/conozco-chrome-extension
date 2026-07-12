# Conozco Chrome Extension

Chrome extension for adding words and phrases to your [Conozco](https://conozco.net) vocabulary.

## Requirements

- Node.js 20+
- pnpm 9+ (`corepack enable`)
- Google Chrome

## Usage

1. Sign in via the extension popup
2. Select a word or phrase (1–100 characters) on any webpage
3. Click the blue **+** button that appears near the selection
4. The word is added to your Conozco vocabulary

## Development

```bash
pnpm install

# Point to local Conozco backend
VITE_API_BASE=http://localhost:8000 pnpm dev
```

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. **Load unpacked** → `.output/chrome-mv3`
4. Copy the extension ID into flash-cards `.env.local`:
   ```env
   NEXT_PUBLIC_EXTENSION_ID=<extension-id>
   ```
5. Sign in via extension popup → **Sign in to Conozco** → `/auth/extension-connect`

## Production build

```bash
pnpm build
pnpm zip
```

## API used

| Endpoint | Purpose |
|----------|---------|
| `GET /api/extension/me` | Profile (Bearer token) |
| `POST /api/extension/words/quick-add` | Add selected word |
| `/auth/extension-connect` | OAuth-style token handoff |

Main app repo: [iluha5/conozco](https://github.com/iluha5/conozco) (flash-cards).
