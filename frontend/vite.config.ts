import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          query: ["@tanstack/react-query", "axios"],
          form: ["react-hook-form", "@hookform/resolvers", "zod"],
          motion: ["framer-motion", "lucide-react"]
        }
      }
    }
  },
  server: {
    port: 5173
  }
});
