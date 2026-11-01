import {execFileSync} from 'node:child_process';
import {mkdir, readFile, writeFile, copyFile} from 'node:fs/promises';
const root = new URL('./', import.meta.url);
execFileSync(process.execPath, ['sims/build.mjs', 'v8-live'], {cwd: new URL('teardown/', root), stdio: 'inherit'});
await mkdir(new URL('docs/', root), {recursive: true});
const licenses = [
  ['teardown/LICENSE', 'teardown / claude-motion'],
  ['teardown/node_modules/three/LICENSE', 'three.js'],
  ['teardown/node_modules/@fontsource-variable/inter/LICENSE', 'Inter'],
  ['teardown/node_modules/@fontsource/jetbrains-mono/LICENSE', 'JetBrains Mono'],
];
const notices = (await Promise.all(licenses.map(async ([file, name]) => `${name}\n${await readFile(new URL(file, root), 'utf8')}`))).join('\n\n');
let html = await readFile(new URL('teardown/teardown-out/dist/v8-live.html', root), 'utf8');
html = html.replace('<title>v8-live</title>', '<title>V8 · Interactive Four-Stroke Simulator</title>');
html = html.replace('<head>', `<head>\n<!--\n${notices.replaceAll('--', '—')}\n-->`);
await writeFile(new URL('docs/index.html', root), html);
await writeFile(new URL('docs/THIRD-PARTY-NOTICES.txt', root), notices);
await writeFile(new URL('docs/.nojekyll', root), '');
await copyFile(new URL('teardown/LICENSE', root), new URL('LICENSE', root));
console.log('Publish bundle ready: docs/index.html');
