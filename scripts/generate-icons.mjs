/**
 * Renders raster icon assets from the brand master SVG.
 *
 * - Legacy Android launcher icons (pre-API 26 fallback, one per density).
 * - Web favicon used by `ionic serve` / the browser build.
 *
 * Adaptive icons and the splash screen use vector drawables directly
 * (resources/android/icon/*.xml, resources/android/splash/ic_splash.xml),
 * so they do not need rasterizing.
 *
 * Usage: npm run assets:icons
 */
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const MASTER = 'resources/brand/icon.svg';
const ANDROID_ICON_DIR = 'resources/android/icon';
const FAVICON = 'src/assets/icon/favicon.png';

/** Launcher icon size (px) per Android density bucket. */
const LAUNCHER_SIZES = {
  mdpi: 48,
  hdpi: 72,
  xhdpi: 96,
  xxhdpi: 144,
  xxxhdpi: 192,
};

const render = (size, output) => sharp(MASTER).resize(size, size).png().toFile(output);

await mkdir(ANDROID_ICON_DIR, { recursive: true });

await Promise.all([
  ...Object.entries(LAUNCHER_SIZES).map(([density, size]) =>
    render(size, `${ANDROID_ICON_DIR}/${density}.png`),
  ),
  render(64, FAVICON),
]);

console.log(`Rendered ${Object.keys(LAUNCHER_SIZES).length} launcher icons and the favicon.`);
