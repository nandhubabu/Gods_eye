import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      child_process: path.resolve(__dirname, 'src/utils/child_process_mock.js')
    }
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api/celestrak': {
        target: 'https://celestrak.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/celestrak/, '')
      },
      '/api/adsb': {
        target: 'https://api.adsb.lol',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/adsb/, '')
      },
      '/api/usgs': {
        target: 'https://earthquake.usgs.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/usgs/, '')
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          'deckgl-vendor': ['deck.gl', '@deck.gl/core', '@deck.gl/layers', '@deck.gl/aggregation-layers'],
          'maplibre-vendor': ['maplibre-gl'],
          'react-vendor': ['react', 'react-dom']
        }
      }
    }
  }
});
