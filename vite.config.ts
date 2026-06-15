import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // CSS is imported as a string (index.css?inline) and injected by main.tsx
  // into the element's own root node, so styles work in HA panel mode even
  // when the panel is mounted inside a shadow DOM. Result: a single
  // self-contained main.js with no separate stylesheet.
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
