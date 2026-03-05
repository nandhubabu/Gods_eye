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
  },
});
