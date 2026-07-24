/*
We're using some Docker runtime-level env variables.
We cannot simply use `process.env` as they will be baked during Docker
build phase, so this is bypassing build optimisation via Next.
Right now these variables are only injected in client-side application.
As injection is not isomorphic, access only works via `window` by design -
this allows developer to keep in mind that only client-side has access there.
*/
import { resolve, dirname } from 'node:path';
import { ensureDirSync } from 'fs-extra';
import { copyFileSync, writeFileSync } from 'fs';
import * as dynamics from '../env-dynamics.mjs';

export default () => {
  if (process.env.NODE_NO_BUILD_DYNAMICS) {
    return;
  }
  const path = resolve('./public/runtime/window-env.js');
  ensureDirSync(dirname(path));
  writeFileSync(path, `window.__env__=${JSON.stringify(dynamics)}`);

  const moduleMode = (process.env.MODULE || 'csm').toLowerCase();
  copyFileSync(
    resolve(`./public/manifest-${moduleMode}.json`),
    resolve('./public/manifest.json'),
  );

  const favicons = [
    ['favicon.ico', `favicon-${moduleMode}.ico`],
    ['favicon-16x16.png', `favicon-${moduleMode}-16x16.png`],
    ['favicon-32x32.png', `favicon-${moduleMode}-32x32.png`],
    ['favicon-192x192.png', `favicon-${moduleMode}-192x192.png`],
    ['favicon-512x512.png', `favicon-${moduleMode}-512x512.png`],
    ['apple-touch-icon.png', `apple-touch-icon-${moduleMode}.png`],
  ];
  favicons.forEach(([target, source]) => {
    copyFileSync(resolve(`./public/${source}`), resolve(`./public/${target}`));
  });

  console.info('created runtime files');
};
