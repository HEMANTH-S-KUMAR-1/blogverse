import { spawnSync } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * This script bypasses the Windows "ENOENT mkdtemp" bug in OpenNext 
 * by redirecting the temporary directory to a local, predictable path.
 */

const tmpDir = join(process.cwd(), '.tmp-build');
if (!existsSync(tmpDir)) {
  mkdirSync(tmpDir, { recursive: true });
}

// Override TEMP/TMP environment variables for the current process and its children
const env = { 
  ...process.env, 
  TEMP: tmpDir, 
  TMP: tmpDir 
};

console.log(`[OpenNext Fix] Redirecting TEMP to local path: ${tmpDir}`);

// Use the local binary to avoid npx resolution issues
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
