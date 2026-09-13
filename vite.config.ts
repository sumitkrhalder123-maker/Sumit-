import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  // Determine appropriate base URL:
  // 1. If explicitly provided via non-empty BASE_URL (and not just root slash unless it's a root domain), use it
  // 2. If running in GitHub Actions with GITHUB_REPOSITORY (e.g. user/portfolio), use /portfolio/
  // 3. Fallback to './' for local preview or manual relative deployments
  let base = './';
  const rawBase = process.env.BASE_URL ? process.env.BASE_URL.trim() : '';

  if (rawBase && rawBase !== '' && rawBase !== '/') {
    base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;
  } else if (process.env.GITHUB_REPOSITORY) {
    const parts = process.env.GITHUB_REPOSITORY.split('/');
    const repo = parts[1];
    if (repo && repo.toLowerCase().endsWith('.github.io')) {
      base = '/';
    } else if (repo) {
      base = `/${repo}/`;
    }
  } else if (rawBase === '/') {
    base = '/';
  }

  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
