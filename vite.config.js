import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,   // This will bind the server to all network interfaces
    port: 3000,
    open: true    // This will open the browser automatically
  }
});
