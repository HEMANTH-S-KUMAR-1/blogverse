import { spawnSync } from 'node:child_process';
import { mkdirSync, existsSync, renameSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const tmpDir = join(process.cwd(), '.tmp-build');
if (!existsSync(tmpDir)) {
  mkdirSync(tmpDir, { recursive: true });
}

const env = {
  ...process.env,
  TEMP: tmpDir,
  TMP: tmpDir
};

console.log(`[OpenNext Fix] Redirecting TEMP to local path: ${tmpDir}`);

const binary = process.platform === 'win32'
  ? join('node_modules', '.bin', 'opennextjs-cloudflare.cmd')
  : join('node_modules', '.bin', 'opennextjs-cloudflare');

const result = spawnSync(binary, ['build'], {
  stdio: 'inherit',
  shell: true,
  env
});

if (result.status !== 0) {
  console.error(`[OpenNext Fix] Build failed with status ${result.status}`);
  process.exit(result.status || 1);
}

// Patch: remove node:sqlite reference from handler.mjs before Wrangler bundles it
const handlerPath = join(process.cwd(), '.open-next', 'server-functions', 'default', 'handler.mjs');
if (existsSync(handlerPath)) {
  console.log('[OpenNext Fix] Patching node:sqlite out of handler.mjs...');
  let content = readFileSync(handlerPath, 'utf8');
  content = content.replace(/"node:sqlite"\s*:\s*\(\)\s*=>\s*require\("node:sqlite"\),?/g, '');
  writeFileSync(handlerPath, content, 'utf8');
  console.log('[OpenNext Fix] Patch applied.');
}

// Rename worker.js to _worker.js for Cloudflare Pages
const outputDir = join(process.cwd(), '.open-next');
const oldPath = join(outputDir, 'worker.js');
const newPath = join(outputDir, '_worker.js');

if (existsSync(oldPath)) {
  console.log(`[OpenNext Fix] Renaming ${oldPath} to ${newPath}`);
  renameSync(oldPath, newPath);
} else {
  console.log(`[OpenNext Fix] Note: ${oldPath} not found.`);
}