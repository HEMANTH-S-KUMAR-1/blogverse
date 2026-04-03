import { spawnSync } from 'node:child_process';
import { mkdirSync, existsSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import { build } from 'esbuild';

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

// Post-build: Re-bundle worker.js with node:sqlite external, output as _worker.js
const outputDir = join(process.cwd(), '.open-next');
const workerJs = join(outputDir, 'worker.js');
const workerFinal = join(outputDir, '_worker.js');

if (existsSync(workerJs)) {
  console.log(`[OpenNext Fix] Re-bundling worker with node:sqlite as external...`);
  await build({
    entryPoints: [workerJs],
    outfile: workerFinal,
    bundle: true,
    format: 'esm',
    platform: 'browser',
    external: ['node:sqlite', 'node:worker_threads'],
    logLevel: 'info',
  });
  console.log(`[OpenNext Fix] Re-bundle complete: ${workerFinal}`);
} else {
  console.log(`[OpenNext Fix] Note: ${workerJs} not found.`);
}