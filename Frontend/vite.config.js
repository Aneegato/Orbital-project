import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'node_modules')
    }
  },
  build: {
    outDir: 'dist'
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://f38e-58-140-20-247.ngrok-free.app', // Ensure this is correct
        changeOrigin: true,
        secure: false, // Add this line to ensure it works with ngrok
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
