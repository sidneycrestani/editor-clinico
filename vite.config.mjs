import { defineConfig } from 'vite'

export default defineConfig({
  base: '/MedDraft/',
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
