/**
 * Live reload on Android (replacement for the broken `ionic cordova run android -l`).
 *
 * Ionic's livereload target injects cordova.js through Webpack `indexHtml` transforms, which the
 * esbuild-based `@angular/build:application` builder rejects. Instead we:
 *
 *   1. generate `.livereload/index.html` (src/index.html + <script src="cordova.js">),
 *   2. serve it with `ng serve --configuration livereload` (also serves platforms/android/platform_www:
 *      cordova.js, cordova_plugins.js and the plugin JS, so the SQLite plugin keeps working),
 *   3. temporarily point config.xml at the dev server (+ cleartext HTTP) and `cordova run android`,
 *   4. on exit, restore config.xml and `cordova prepare android` so the native project is clean.
 *
 * Usage: npm run android:live -- [--emulator | --device | --target <id>] [--host <ip>]
 * Env:   LIVERELOAD_HOST overrides the host (same as --host).
 */
import { spawn, spawnSync } from 'node:child_process';
import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import http from 'node:http';
import { networkInterfaces } from 'node:os';

const PORT = 8100;
const BIND_HOST = '0.0.0.0';
const NG_CONFIGURATION = 'livereload';
const SERVER_READY_TIMEOUT_MS = 180_000;
const SERVER_POLL_INTERVAL_MS = 1_000;
const REQUEST_TIMEOUT_MS = 2_000;
const HTTP_OK = 200;
const EXIT_FAILURE = 1;
const SIGNAL_EXIT_CODE = { SIGINT: 130, SIGTERM: 143 };

const CONFIG_XML = 'config.xml';
const CONFIG_BACKUP = 'config.xml.livereload.bak';
const SOURCE_INDEX = 'src/index.html';
const LIVE_DIR = '.livereload';
const LIVE_INDEX = `${LIVE_DIR}/index.html`;
const PLATFORM_WWW = 'platforms/android/platform_www';
const MANIFEST = 'platforms/android/app/src/main/AndroidManifest.xml';
const PLATFORM_JSON = 'platforms/android/android.json';
const MANIFEST_MUNGE_KEY = 'app/src/main/AndroidManifest.xml';
const CLEARTEXT_ATTRIBUTE = / android:usesCleartextTraffic="true"/;
const CORDOVA_SCRIPT = '<script src="cordova.js"></script>';
const HEAD_CLOSE = '</head>';

const ANDROID_NS = 'xmlns:android="http://schemas.android.com/apk/res/android"';
const CLEARTEXT_EDIT_CONFIG =
  '<edit-config file="app/src/main/AndroidManifest.xml" mode="merge" target="/manifest/application">' +
  '<application android:usesCleartextTraffic="true" /></edit-config>';

/** Interfaces that exist on the host but are not reachable from a phone or the emulator. */
const VIRTUAL_INTERFACE =
  /^(utun|tun|tap|bridge|vmnet|vboxnet|docker|veth|br-|lo|awdl|llw|ap\d|gif|stf)/i;

const FLAG = { emulator: '--emulator', device: '--device', target: '--target', host: '--host' };
const DEVICE_FLAGS = [FLAG.emulator, FLAG.device];

const log = (message) => console.log(`[android:live] ${message}`);
const run = (command, args) => spawnSync(command, args, { stdio: 'inherit' });

function parseArgs(argv) {
  const options = { cordovaArgs: [], host: process.env.LIVERELOAD_HOST };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === FLAG.host) options.host = argv[++i];
    else if (arg.startsWith(`${FLAG.host}=`)) options.host = arg.slice(FLAG.host.length + 1);
    else if (arg === FLAG.target) options.cordovaArgs.push(`${FLAG.target}=${argv[++i]}`);
    else if (arg.startsWith(`${FLAG.target}=`) || DEVICE_FLAGS.includes(arg))
      options.cordovaArgs.push(arg);
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return options;
}

function resolveHost(override) {
  if (override) return override;
  const candidates = Object.entries(networkInterfaces())
    .filter(([name]) => !VIRTUAL_INTERFACE.test(name))
    .flatMap(([, addresses = []]) => addresses)
    .filter((address) => address.family === 'IPv4' && !address.internal);
  if (!candidates.length) {
    throw new Error('No LAN IPv4 address found. Pass one with --host <ip> or LIVERELOAD_HOST.');
  }
  return candidates[0].address;
}

async function restoreConfig() {
  if (!existsSync(CONFIG_BACKUP)) return false;
  await copyFile(CONFIG_BACKUP, CONFIG_XML);
  await rm(CONFIG_BACKUP);
  return true;
}

async function writeLiveIndex() {
  const source = await readFile(SOURCE_INDEX, 'utf8');
  if (!source.includes(HEAD_CLOSE))
    throw new Error(`${SOURCE_INDEX} has no ${HEAD_CLOSE} to inject into.`);
  await mkdir(LIVE_DIR, { recursive: true });
  // Head + synchronous: cordova.js is ready before Angular boots, so `deviceready` reaches platform.ready.
  await writeFile(LIVE_INDEX, source.replace(HEAD_CLOSE, `  ${CORDOVA_SCRIPT}\n  ${HEAD_CLOSE}`));
}

async function patchConfig(origin) {
  await copyFile(CONFIG_XML, CONFIG_BACKUP);
  let xml = await readFile(CONFIG_XML, 'utf8');
  if (!xml.includes('xmlns:android=')) xml = xml.replace('<widget ', `<widget ${ANDROID_NS} `);
  xml = xml
    .replace(
      /<content src="[^"]*"\s*\/>/,
      `<content src="${origin}" />\n    <allow-navigation href="${origin}/*" />`,
    )
    .replace(/(<platform name="android">)/, `$1\n        ${CLEARTEXT_EDIT_CONFIG}`);
  await writeFile(CONFIG_XML, xml);
}

const probe = (url) =>
  new Promise((resolve) => {
    const request = http.get(url, { timeout: REQUEST_TIMEOUT_MS }, (response) => {
      response.resume();
      resolve(response.statusCode === HTTP_OK);
    });
    request.on('error', () => resolve(false));
    request.on('timeout', () => request.destroy());
  });

async function waitForServer(url, isAlive) {
  const deadline = Date.now() + SERVER_READY_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (!isAlive()) throw new Error('ng serve exited before it was ready.');
    if (await probe(url)) return;
    await new Promise((resolve) => setTimeout(resolve, SERVER_POLL_INTERVAL_MS));
  }
  throw new Error(`Dev server not ready after ${SERVER_READY_TIMEOUT_MS / 1000}s.`);
}

/**
 * Cordova's edit-config does not revert on `prepare`: it leaves the attribute in the manifest and the
 * munge record in android.json (which would also stop the next run from re-applying it). Undo both by hand.
 */
async function revertCleartext() {
  if (existsSync(MANIFEST)) {
    const manifest = await readFile(MANIFEST, 'utf8');
    await writeFile(MANIFEST, manifest.replace(CLEARTEXT_ATTRIBUTE, ''));
  }
  if (existsSync(PLATFORM_JSON)) {
    const platform = JSON.parse(await readFile(PLATFORM_JSON, 'utf8'));
    delete platform.config_munge?.files?.[MANIFEST_MUNGE_KEY];
    await writeFile(PLATFORM_JSON, `${JSON.stringify(platform, null, 2)}\n`);
  }
}

let ngServe;
let cleaning;

function cleanup() {
  cleaning ??= (async () => {
    if (ngServe && ngServe.exitCode === null) ngServe.kill('SIGTERM');
    if (await restoreConfig()) {
      log('config.xml restored. Re-syncing the native project (cordova prepare android)...');
      run('npx', ['cordova', 'prepare', 'android']);
      await revertCleartext();
      log(
        'Done. The installed app still points to the dev server: run `npm run android:run` to reinstall the packaged app.',
      );
    }
  })();
  return cleaning;
}

for (const [signal, code] of Object.entries(SIGNAL_EXIT_CODE)) {
  process.on(signal, () => cleanup().finally(() => process.exit(code)));
}

async function main() {
  const { host: hostOverride, cordovaArgs } = parseArgs(process.argv.slice(2));

  if (!existsSync(PLATFORM_WWW)) {
    throw new Error(`${PLATFORM_WWW} not found. Run \`npm run android:build\` once first.`);
  }
  if (await restoreConfig())
    log('Found a stale config.xml backup from a previous run: restored it.');

  const origin = `http://${resolveHost(hostOverride)}:${PORT}`;
  log(`Device will load ${origin}`);

  await writeLiveIndex();
  ngServe = spawn(
    'npx',
    [
      'ng',
      'serve',
      '--configuration',
      NG_CONFIGURATION,
      '--host',
      BIND_HOST,
      '--port',
      String(PORT),
    ],
    { stdio: 'inherit' },
  );
  await waitForServer(`http://127.0.0.1:${PORT}/`, () => ngServe.exitCode === null);
  log('Dev server is up.');

  await patchConfig(origin);
  const result = run('npx', ['cordova', 'run', 'android', '--debug', ...cordovaArgs]);
  if (result.status !== 0) throw new Error('`cordova run android` failed.');

  log(
    'App installed and loading from the dev server. Edit src/ and the app reloads. Ctrl+C to stop and restore config.xml.',
  );
  await new Promise((resolve) => ngServe.once('exit', resolve));
}

main()
  .catch((error) => {
    console.error(`[android:live] ${error.message}`);
    process.exitCode = EXIT_FAILURE;
  })
  .finally(() => cleanup());
