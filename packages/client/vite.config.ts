import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: Number(process.env.CLIENT_PORT) || 3000,
  },
  resolve: {
    alias: {
      api: path.join(__dirname, './src/api'),
      app: path.join(__dirname, './src/app'),
      assets: path.join(__dirname, './src/assets'),
      components: path.join(__dirname, './src/components'),
      'components-ui': path.join(__dirname, './src/components-ui'),
      constants: path.join(__dirname, './src/constants'),
      core: path.join(__dirname, './src/core'),
      game: path.join(__dirname, './src/game'),
      helpers: path.join(__dirname, './src/helpers'),
      hocs: path.join(__dirname, './src/hocs'),
      hooks: path.join(__dirname, './src/hooks'),
      layouts: path.join(__dirname, './src/layouts'),
      models: path.join(__dirname, './src/models'),
      pages: path.join(__dirname, './src/pages'),
      translations: path.join(__dirname, './src/translations'),
      typings: path.join(__dirname, './src/typings'),
    },
  },
  ssr: {
    target: 'node',
    format: 'cjs',
  },
  define: {
    __SERVER_PORT__: process.env.SERVER_PORT,
  },
  plugins: [react()],
});
