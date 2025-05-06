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
      "@Animations": path.resolve(__dirname, "src/assets/animations/index.ts"),
      "@API": path.resolve(__dirname, "src/api/index.ts"),
      "@GameAssets": path.resolve(__dirname, "src/assets/game/index.ts"),
      "@Images": path.resolve(__dirname, "src/assets/images/index.ts"),
      "@Styles": path.resolve(__dirname, "src/assets/styles/index.ts"),
      "@Components": path.resolve(__dirname, "src/components/index.ts"),
      "@Data": path.resolve(__dirname, "src/data/index.ts"),
      //features
      "@Auth": path.resolve(__dirname, "src/features/authentication/index.ts"),
      "@Chat": path.resolve(__dirname, "src/features/chat/index.ts"),
      "@Game": path.resolve(__dirname, "src/features/game/index.ts"),
      "@Leaderboards": path.resolve(__dirname, "src/features/leaderboards/index.ts"),
      "@Lobby": path.resolve(__dirname, "src/features/lobby/index.ts"),
      "@LobbyList": path.resolve(__dirname, "src/features/lobbyList/index.ts"),
      "@MainMenu": path.resolve(__dirname, "src/features/mainMenu/index.ts"),
      "@MyProfile": path.resolve(__dirname, "src/features/myProfile/index.ts"),
      "@Notifications": path.resolve(__dirname, "src/features/notifications/index.ts"),
      "@Settings": path.resolve(__dirname, "src/features/settings/index.ts"),
      //
      "@Hooks": path.resolve(__dirname, "src/hooks/index.ts"),
      "@Library": path.resolve(__dirname, "src/lib/index.ts"),
      "@Pages": path.resolve(__dirname, "src/pages/index.ts"),
      "@Routes": path.resolve(__dirname, "src/routes/index.ts"),
      "@Services": path.resolve(__dirname, "src/services/index.ts"),
      "@Store": path.resolve(__dirname, "src/store/index.ts"),
      "@Types": path.resolve(__dirname, "src/types/index.ts"),
      "@Utils": path.resolve(__dirname, "src/utils/index.ts"),
    }
  }
})
