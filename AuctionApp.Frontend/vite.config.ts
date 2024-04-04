import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import path from "path"



// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
       "/api": {
        target: "http://localhost:5131", // backend server port
        changeOrigin: true,
      },
      "/r": {
        target: "http://127.0.0.1:5131",
        ws: true,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
      postcss: {
        plugins: [tailwindcss()],
      },
    }
})
