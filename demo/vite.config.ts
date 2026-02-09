import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import pkg from '../package.json';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@forgedevstack/forge-compass': path.resolve(__dirname, '../src'),
      '@forgedevstack/forge-compass/react': path.resolve(__dirname, '../src/adapters/react'),
      '@forgedevstack/forge-compass/devtools': path.resolve(__dirname, '../src/devtools'),
    },
  },
  define: {
    __FORGE_COMPASS_VERSION__: JSON.stringify(pkg.version),
  },
});

