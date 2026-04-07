import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'legoace_logo.png'],
      manifest: {
        name: 'LegoAce Legalflow',
        short_name: 'LegoAce',
        description: 'Smart Case Management System For Individual Lawyers',
        theme_color: '#16a34a',
        background_color: '#f9fafb',
        display: 'standalone',
        icons: [
          {
            src: '/legoace_logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/legoace_logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})
// good
