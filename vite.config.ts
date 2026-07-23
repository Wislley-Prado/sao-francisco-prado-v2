import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "node:fs";
import zlib from "node:zlib";
import { VitePWA } from 'vite-plugin-pwa';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

/**
 * Plugin Nativo Node.js para Compressão Brotli (.br) e Gzip (.gz)
 * Utiliza o módulo zlib nativo do Node sem dependências externas.
 */
const nativeCompression = () => ({
  name: 'vite-native-compression',
  apply: 'build' as const,
  closeBundle() {
    const distDir = path.resolve(__dirname, 'dist');
    const compressFile = (filePath: string) => {
      if (
        filePath.endsWith('.js') ||
        filePath.endsWith('.css') ||
        filePath.endsWith('.html') ||
        filePath.endsWith('.svg') ||
        filePath.endsWith('.json')
      ) {
        try {
          const content = fs.readFileSync(filePath);
          if (content.length > 512) {
            // Gzip (.gz)
            const gz = zlib.gzipSync(content, { level: 9 });
            fs.writeFileSync(`${filePath}.gz`, gz);

            // Brotli (.br)
            const br = zlib.brotliCompressSync(content, {
              params: {
                [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
              },
            });
            fs.writeFileSync(`${filePath}.br`, br);
          }
        } catch (err) {
          console.warn(`[Compressão] Erro ao comprimir ${filePath}:`, err);
        }
      }
    };

    const walkDir = (dir: string) => {
      if (!fs.existsSync(dir)) return;
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
          walkDir(fullPath);
        } else {
          compressFile(fullPath);
        }
      }
    };

    walkDir(distDir);
    console.log('⚡ [Compressão Nativa ✅] Arquivos Brotli (.br) e Gzip (.gz) gerados com sucesso na pasta dist!');
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    nativeCompression(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'inline',
      selfDestroying: mode !== 'production', // Desabilita e destrói o Service Worker em desenvolvimento
      devOptions: {
        enabled: false,
        suppressWarnings: true,
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
      },
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
    target: ["es2015", "chrome64", "edge79", "firefox67", "safari12"],
    minify: "esbuild",
    cssMinify: true,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-dom") || id.includes("react-router-dom") || (id.includes("react") && !id.includes("react-day-picker"))) {
              return "vendor-core";
            }
            if (id.includes("recharts")) {
              return "vendor-recharts";
            }
            if (id.includes("jspdf") || id.includes("html2canvas")) {
              return "vendor-pdf";
            }
            if (id.includes("@tiptap")) {
              return "vendor-editor";
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
