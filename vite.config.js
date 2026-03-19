import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import pkg from './package.json';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'public',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        atlas: path.resolve(__dirname, 'app/assets/js/atlas.jsx'),
        admin: path.resolve(__dirname, 'app/assets/js/admin.jsx'),
        atlas_css: path.resolve(__dirname, 'app/assets/scss/atlas.scss'),
        admin_css: path.resolve(__dirname, 'app/assets/scss/admin.scss'),
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name.endsWith('_css')) return 'css/[name].css'
          return 'js/[name].bundle.js'
        },
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return `css/${assetInfo.name.replace('_css.css','.css')}`
          }
          return 'assets/[name].[hash][extname]'
        },
      },
    },
  },
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(pkg.version)
  }
});
