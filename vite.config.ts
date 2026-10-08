import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { razorpayDevServerPlugin } from './src/server/razorpayDevServer.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), razorpayDevServerPlugin()],
  envPrefix: ['VITE_', 'GEMINI_'],
})
