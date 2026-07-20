import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from 'vite-plugin-pwa';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    VitePWA({
      selfDestroying: true, // Auto-destrói qualquer Service Worker antigo no navegador do usuário
      registerType: 'autoUpdate',
      injectRegister: null, // Impede injeção automática de registro de SW
      manifest: false,
      devOptions: {
        enabled: false
      }
    }),
    ViteImageOptimizer({
      png: {
        quality: 80,
      },
      jpeg: {
        quality: 80,
      },
      jpg: {
        quality: 80,
      },
      webp: {
        quality: 80,
      },
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                cleanupNumericValues: false,
                removeViewBox: false,
              },
            },
          },
        ],
      },
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom") || id.includes("@tanstack/react-query")) {
              return "vendor-react";
            }
            if (id.includes("@radix-ui") || id.includes("lucide-react") || id.includes("clsx") || id.includes("tailwind-merge")) {
              return "vendor-ui";
            }
            if (id.includes("recharts")) {
              return "vendor-recharts";
            }
            if (id.includes("@supabase")) {
              return "vendor-supabase";
            }
            if (id.includes("@tiptap")) {
              return "vendor-editor";
            }
            if (id.includes("jspdf")) {
              return "vendor-pdf";
            }
            if (id.includes("i18next")) {
              return "vendor-i18n";
            }
            if (id.includes("mapbox-gl")) {
              return "vendor-mapbox";
            }
          }
        },
      },
    },
  },
}));
