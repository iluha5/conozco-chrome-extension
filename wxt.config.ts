import { defineConfig } from 'wxt';

const apiBase = process.env.VITE_API_BASE ?? 'https://conozco.net';
const isDevelopment = process.env.NODE_ENV !== 'production';

export default defineConfig({
  modules: [],
  vite: () => ({
    define: {
      __API_BASE__: JSON.stringify(apiBase),
    },
  }),
  manifest: () => ({
    name: isDevelopment ? 'Conozco (Dev)' : 'Conozco — Add Words',
    description: 'Quickly add words and phrases to your Conozco vocabulary from any webpage',
    homepage_url: 'https://conozco.net/extension',
    permissions: ['storage'],
    host_permissions: [
      'https://conozco.net/*',
      ...(isDevelopment ? ['http://localhost:8000/*'] : []),
    ],
    externally_connectable: {
      matches: ['https://conozco.net/*', ...(isDevelopment ? ['http://localhost:8000/*'] : [])],
    },
    action: {
      default_title: 'Conozco',
    },
  }),
});
