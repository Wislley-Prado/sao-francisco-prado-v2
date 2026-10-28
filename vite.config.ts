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
      selfDestroying: true, // Desregistra Service Worker antigo sem precache invasivo de 5MB
      devOptions: {
        enabled: false,
        suppressWarnings: true,
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
            // 1. PDF generation (carregado apenas sob demanda para exportar relatório)
            if (
              id.includes("jspdf") ||
              id.includes("html2canvas") ||
              id.includes("canvg") ||
              id.includes("fflate") ||
              id.includes("brotli")
            ) {
              return "vendor-pdf";
            }

            // 2. Editor de texto rico Tiptap/ProseMirror (apenas para o painel admin)
            if (id.includes("@tiptap") || id.includes("prosemirror")) {
              return "vendor-editor";
            }

            // 3. Gráficos (Recharts e D3)
            if (id.includes("recharts") || id.includes("d3-")) {
              return "vendor-recharts";
            }

            // 4. Mapbox GL
            if (id.includes("mapbox-gl")) {
              return "vendor-mapbox";
            }

            // 5. Core React & Router
            if (
              id.includes("/node_modules/react/") ||
              id.includes("/node_modules/react-dom/") ||
              id.includes("/node_modules/react-router/") ||
              id.includes("/node_modules/react-router-dom/") ||
              id.includes("/node_modules/scheduler/")
            ) {
              return "vendor-core";
            }

            // 6. Componentes e utilitários de UI
            if (
              id.includes("clsx") ||
              id.includes("tailwind-merge") ||
              id.includes("class-variance-authority") ||
              id.includes("@radix-ui") ||
              id.includes("lucide-react")
            ) {
              return "vendor-ui";
            }

            // 7. Supabase & React Query
            if (id.includes("@supabase") || id.includes("@tanstack")) {
              return "vendor-query";
            }
          }
        },
      },
    },
  },
}));
