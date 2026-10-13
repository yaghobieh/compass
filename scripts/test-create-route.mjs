import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const entry = fileURLToPath(new URL('../tests/createRoute.test.ts', import.meta.url));
const dir = await mkdtemp(join(tmpdir(), 'compass-create-route-'));
const outfile = join(dir, 'createRoute.test.mjs');

await build({
  entryPoints: [entry],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile,
  target: 'node20',
});

try {
  await import(pathToFileURL(outfile).href);
} finally {
  await rm(dir, { recursive: true, force: true });
}
