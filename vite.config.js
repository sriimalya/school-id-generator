import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["chewable-smirk-perkiness.ngrok-free.dev"],
  },
});
