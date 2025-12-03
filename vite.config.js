import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import lessgo from './vite-plugin-lessgo.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    lessgo(), // Use less.go for LESS compilation
    react(),
  ],
  css: {
    // Disable Vite's built-in LESS handling since we use lessgo
    preprocessorOptions: {
      less: {
        // This won't be used since lessgo plugin handles .less files
      },
    },
  },
})
