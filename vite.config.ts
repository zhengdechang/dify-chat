/*
 * @Description:
 * @Author: Devin
 * @Date: 2025-08-13 20:14:35
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === "lib") {
    return {
      plugins: [
        react(),
        dts({
          insertTypesEntry: true,
          include: ["src/**/*"],
          exclude: ["src/**/*.test.*", "src/**/*.spec.*", "src/demo/**/*"],
        }),
      ],
      build: {
        lib: {
          entry: resolve(
            fileURLToPath(new URL(".", import.meta.url)),
            "src/index.ts"
          ),
          name: "DifyChatTools",
          formats: ["es", "umd"],
          fileName: (format) => `index.${format === "es" ? "esm" : format}.js`,
        },
        rollupOptions: {
          external: [
            "react",
            "react-dom",
            "react/jsx-runtime",
            "framer-motion",
            "lucide-react",
            "clsx",
            "marked",
            "react-markdown",
            "remark-gfm",
            "shiki",
          ],
          output: {
            globals: {
              react: "React",
              "react-dom": "ReactDOM",
              "react/jsx-runtime": "React",
              "framer-motion": "FramerMotion",
              "lucide-react": "LucideReact",
              clsx: "clsx",
              marked: "marked",
              "react-markdown": "ReactMarkdown",
              "remark-gfm": "remarkGfm",
              shiki: "shiki",
            },
          },
        },
        cssCodeSplit: false,
      },
    };
  }

  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
      proxy: {
        "/api/dify": {
          target: "https://api.dify.ai",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/dify/, "/v1"),
        },
      },
    },
  };
});
