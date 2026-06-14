import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/local/wallcal/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: 'main.js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  server: {
    proxy: {
      '/api': 'http://homeassistant.local:8123',
      '/auth': 'http://homeassistant.local:8123'
    }
  }
})
