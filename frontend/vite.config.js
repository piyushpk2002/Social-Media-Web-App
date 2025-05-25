import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // get rid of cors error 
    proxy: {
      "/api": {
        target: "https://social-media-web-app-ldnu.onrender.com",
        changeOrigin: true,
        secure: false //for http and for https secure: true
      }
    }
  }
})
