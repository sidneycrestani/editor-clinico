import { defineConfig } from 'vite'

export default defineConfig({
  base: '/editor-clinico/',
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
