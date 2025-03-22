
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Only use componentTagger in development mode and if it can be imported
    mode === 'development' && (() => {
      try {
        // Safely try to import the lovable-tagger package
        const tagger = require("lovable-tagger");
        if (typeof tagger.componentTagger === 'function') {
          return tagger.componentTagger();
        }
        return null;
      } catch (e) {
        console.warn('Could not load lovable-tagger, continuing without it');
        return null;
      }
    })(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
