import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("framer-motion"))  return "vendor-motion";
          if (id.includes("socket.io"))      return "vendor-socket";
          if (id.includes("react-router"))   return "vendor-router";
          if (id.includes("node_modules"))   return "vendor";
        },
      },
    },
  },
});
