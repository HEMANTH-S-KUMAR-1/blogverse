import { spawnSync } from 'node:child_process';
import { mkdirSync, existsSync, renameSync, readFileSync, writeFileSync, statSync } from 'node:fs';
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

const handlerPath = join(process.cwd(), '.open-next', 'server-functions', 'default', 'handler.mjs');
if (existsSync(handlerPath)) {
  console.log('[OpenNext Fix] Patching handler.mjs...');
  let content = readFileSync(handlerPath, 'utf8');

  const before = content.length;

  // Fix node:sqlite
  content = content.replace(/"node:sqlite"\s*:\s*\(\)\s*=>\s*require\("node:sqlite"\),?/g, '');
  content = content.replace(/DatabaseSync\s*=\s*require\("node:sqlite"\)\.DatabaseSync/g, 'DatabaseSync=undefined');
  content = content.replace(/require\("node:sqlite"\)/g, '(undefined)');

  // Remove large inlined base64 wasm blobs (yoga.wasm, resvg.wasm from @vercel/og)
  content = content.replace(/var wasmBase64\s*=\s*"[A-Za-z0-9+/=]{1000,}"/g, 'var wasmBase64=""');
  content = content.replace(/,wasmBase64\s*=\s*"[A-Za-z0-9+/=]{1000,}"/g, ',wasmBase64=""');

  // Remove large inlined base64 font data
  content = content.replace(/var\s+\w+\s*=\s*"(?:AAEAAAA|AAABA)[A-Za-z0-9+/=]{500,}"/g, (m) => m.split('=')[0] + '=""');

  const after = content.length;
  console.log(`[OpenNext Fix] Reduced handler.mjs from ${(before / 1024 / 1024).toFixed(2)}MB to ${(after / 1024 / 1024).toFixed(2)}MB`);

  writeFileSync(handlerPath, content, 'utf8');
  console.log('[OpenNext Fix] Patch applied.');
} else {
  console.log(`[OpenNext Fix] Note: handler.mjs not found at ${handlerPath}`);
}

// Post-build: Rename worker.js to _worker.js
const outputDir = join(process.cwd(), '.open-next');
const oldPath = join(outputDir, 'worker.js');
const newPath = join(outputDir, '_worker.js');

if (existsSync(oldPath)) {
  console.log(`[OpenNext Fix] Renaming ${oldPath} to ${newPath}`);
  renameSync(oldPath, newPath);
} else {
  console.log(`[OpenNext Fix] Note: ${oldPath} not found.`);
}