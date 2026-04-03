import { spawnSync } from 'node:child_process';
import { mkdirSync, existsSync, renameSync, readFileSync, writeFileSync, rmSync, statSync } from 'node:fs';
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

// Patch: remove ALL node:sqlite references from handler.mjs before Wrangler bundles it
const handlerPath = join(process.cwd(), '.open-next', 'server-functions', 'default', 'handler.mjs');
if (existsSync(handlerPath)) {
  console.log('[OpenNext Fix] Patching node:sqlite out of handler.mjs...');
  let content = readFileSync(handlerPath, 'utf8');
  content = content.replace(/"node:sqlite"\s*:\s*\(\)\s*=>\s*require\("node:sqlite"\),?/g, '');
  content = content.replace(/DatabaseSync\s*=\s*require\("node:sqlite"\)\.DatabaseSync/g, 'DatabaseSync=undefined');
  content = content.replace(/require\("node:sqlite"\)/g, '(undefined)');
  writeFileSync(handlerPath, content, 'utf8');
  console.log('[OpenNext Fix] Patch applied.');

  const sizeMB = (statSync(handlerPath).size / 1024 / 1024).toFixed(2);
  console.log(`[OpenNext Fix] handler.mjs size: ${sizeMB} MB`);
} else {
  console.log(`[OpenNext Fix] Note: handler.mjs not found at ${handlerPath}`);
}

// Log worker.js size
const workerPath = join(process.cwd(), '.open-next', 'worker.js');
if (existsSync(workerPath)) {
  const sizeMB = (statSync(workerPath).size / 1024 / 1024).toFixed(2);
  console.log(`[OpenNext Fix] worker.js size: ${sizeMB} MB`);
}

// Remove heavy unused assets
const heavyPaths = [
  // @vercel/og (image generation - not needed for blog)
  join(process.cwd(), '.open-next', 'server-functions', 'default', 'node_modules', 'next', 'dist', 'compiled', '@vercel'),
  // Sharp image processing
  join(process.cwd(), '.open-next', 'server-functions', 'default', 'node_modules', 'sharp'),
  // Next.js swc binaries
  join(process.cwd(), '.open-next', 'server-functions', 'default', 'node_modules', 'next', 'dist', 'compiled', 'babel-packages'),
  // Next.js webpack runtime (not needed in CF workers)
  join(process.cwd(), '.open-next', 'server-functions', 'default', 'node_modules', 'next', 'dist', 'compiled', 'webpack'),
];

for (const f of heavyPaths) {
  if (existsSync(f)) {
    const sizeMB = (statSync(f).size / 1024 / 1024).toFixed(2);
    console.log(`[OpenNext Fix] Removing heavy asset (${sizeMB} MB): ${f}`);
    rmSync(f, { recursive: true, force: true });
  } else {
    console.log(`[OpenNext Fix] Not found (skipping): ${f}`);
  }
}

// Log final worker.js size after removals
if (existsSync(workerPath)) {
  const sizeMB = (statSync(workerPath).size / 1024 / 1024).toFixed(2);
  console.log(`[OpenNext Fix] worker.js final size: ${sizeMB} MB`);
}

// Post-build: Rename worker.js to _worker.js for Cloudflare Pages compatibility
const outputDir = join(process.cwd(), '.open-next');
const oldPath = join(outputDir, 'worker.js');
const newPath = join(outputDir, '_worker.js');

if (existsSync(oldPath)) {
  console.log(`[OpenNext Fix] Renaming ${oldPath} to ${newPath}`);
  renameSync(oldPath, newPath);
} else {
  console.log(`[OpenNext Fix] Note: ${oldPath} not found. It might have been already renamed or build failed.`);
}