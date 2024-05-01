import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import basicSsl from '@vitejs/plugin-basic-ssl';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  mode: 'development',
  base:'https://jsoteldo.github.io/trasnporteFront',
  plugins: [react(), basicSsl(),svgr()],
  build: { chunkSizeWarningLimit: 1600, },
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, './src'),
      '@store': path.resolve(__dirname, './src/store'),
      '@components': path.resolve(__dirname, './src/components'),
      '@modules': path.resolve(__dirname, './src/modules'),
      '@pages': path.resolve(__dirname, './src/pages'),
      'xlsx': 'xlsx/dist/xlsx.mini.min.js',
    },
  },
});
