import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/amazon-clone/', // Apni GitHub repo ka exact name yahan likhein
})