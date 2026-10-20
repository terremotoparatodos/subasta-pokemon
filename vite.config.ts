import { defineConfig } from 'vite';

// host: true → se abre desde el celular o la tablet en la misma red (http://<ip-de-la-pc>:5340).
export default defineConfig({
  base: './',
  server: { port: 5340, strictPort: true, host: true },
});
