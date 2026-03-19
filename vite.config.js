import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  build: {
    outDir: 'public',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        atlas: path.resolve(__dirname, 'app/assets/js/atlas.jsx'),
        admin: path.resolve(__dirname, 'app/assets/js/admin.jsx'),
      },
      output: {
        entryFileNames: 'js/[name].bundle.js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
      },
    },
  },
});
