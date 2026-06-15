import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  // Inject the bundled CSS into main.js at runtime so styles load in HA panel
  // (module_url) mode, where there is no index.html to <link> a separate
  // stylesheet. Result: a single self-contained main.js.
  plugins: [react(), cssInjectedByJsPlugin()],
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
