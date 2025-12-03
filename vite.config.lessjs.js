import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config using built-in less.js processing (no lessgo plugin)
export default defineConfig({
  plugins: [
    react(),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  build: {
    outDir: 'dist-lessjs',
  },
})
