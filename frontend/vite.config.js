import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Em desenvolvimento, as chamadas /api são encaminhadas para a API .NET (mesma origem, sem CORS).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5080',
    },
  },
  // Testes unitários (Vitest): funções, hooks e componentes isolados, sem navegador nem API.
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    include: ['src/**/*.test.{js,jsx}'],
    css: false,
  },
  // O Vitest 3 ainda compila JSX com o esbuild: pede o runtime automático (sem import de React em cada arquivo).
  esbuild: {
    jsx: 'automatic',
  },
})
