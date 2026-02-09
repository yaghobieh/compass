import { defineConfig } from 'tsup';
import pkg from './package.json';

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
      'react/index': 'src/adapters/react/index.ts',
      'devtools/index': 'src/devtools/index.ts',
      'server/index': 'src/server/index.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    external: ['react', 'react-dom', '@forgedevstack/bear'],
    treeshake: true,
    minify: false,
    define: {
      __FORGE_COMPASS_VERSION__: JSON.stringify(pkg.version),
    },
  },
]);

