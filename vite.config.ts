import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  return {
    base: env.GITHUB_PAGES === 'true' ? '/BRIFAN-TECH/' : '/',
    plugins: [react(), tailwindcss()],
  }
})
