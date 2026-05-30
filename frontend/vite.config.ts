import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      '.sandbox.novita.ai',
      '5173-ig7j3l7uwndtzu6qkztci-5c13a017.sandbox.novita.ai'
    ],
    // 백엔드(클라우드 TTS/Whisper 프록시)로 /api 전달. 미기동 시 프론트는 Web Speech로 동작.
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL ?? 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  }
})
