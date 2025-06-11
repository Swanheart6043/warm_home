import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    proxy: {
      '/cgi': {
        target: 'http://192.168.1.200',
        changeOrigin: true,
      },
    }
  },
  plugins: [
    react(),
    tailwindcss()
  ],
})
