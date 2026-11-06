import { cp, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const root = process.cwd();
const output = new URL('../www/', import.meta.url);
const entries = [
  'index.html',
  'styles.css',
  'app.js',
  'assets',
  'admin',
  'aluno',
  'cadastro',
  'manifest.webmanifest',
  'sw.js',
  'back-button.js'
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const entry of entries) {
  const source = new URL('../' + entry, import.meta.url);
  if (!existsSync(source)) {
    if (['index.html', 'styles.css', 'app.js'].includes(entry)) {
      throw new Error('Arquivo essencial ausente: ' + entry);
    }
    continue;
  }
  await cp(source, new URL('../www/' + entry, import.meta.url), { recursive: true });
}

console.log('Web app preparado em /www para Android e iOS.');
