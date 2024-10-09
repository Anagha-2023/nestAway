// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Frontend runs on port 3000
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Proxy API requests to backend port 5000
        changeOrigin: true,
        secure: false,
      },
    },
  },
});