import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Change 'mundial-econ-demo' to your actual repo name
  base: '/mundial-econ-demov2/',
})
