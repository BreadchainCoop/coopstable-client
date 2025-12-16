import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  define: {
    "process.env.NEXT_PUBLIC_DEFAULT_NETWORK": JSON.stringify("PUBLIC"),
  },
  test: {
    environment: "jsdom",
  },
});
