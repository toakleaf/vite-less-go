import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import lessgo from '@lessgo/plugin-vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    lessgo(), // Use less.go for LESS compilation
    react(),
  ],
})
