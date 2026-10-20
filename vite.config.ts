import { defineConfig } from 'vite';

// Base relativa: el mismo build sirve en localhost y en GitHub Pages (/subasta-pokemon/).
// host: true → se abre desde el celular o la tablet en la misma red (http://<ip-de-la-pc>:5340).
export default defineConfig({
  base: './',
  server: { port: 5340, strictPort: true, host: true },
  build: {
    rollupOptions: { input: { main: 'index.html', creditos: 'creditos.html' } },
  },
});
