import react from '@vitejs/plugin-react'
import path from "path"
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsConfigPaths()
  ],
  server: {
    port: 5500
  },
  resolve: {
    alias: {
      "@Animations": path.resolve(__dirname, "src/assets/animations"),
      "@GameAssets": path.resolve(__dirname, "src/assets/game"),
      "@Images": path.resolve(__dirname, "src/assets/images"),
      "@Styles": path.resolve(__dirname, "src/assets/styles"),
      "@Components": path.resolve(__dirname, "src/components"),
      "@Data": path.resolve(__dirname, "src/data"),
      "@Features": path.resolve(__dirname, "src/features"),
      "@Hooks": path.resolve(__dirname, "src/hooks"),
      "@Library": path.resolve(__dirname, "src/lib"),
      "@Pages": path.resolve(__dirname, "src/pages"),
      "@Routes": path.resolve(__dirname, "src/routes"),
      "@Services": path.resolve(__dirname, "src/services"),
      "@Store": path.resolve(__dirname, "src/store"),
      "@Types": path.resolve(__dirname, "src/types"),
      "@Utils": path.resolve(__dirname, "src/utils"),
    }
  }
})
