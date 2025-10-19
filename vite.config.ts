import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        proxy: {
            "/upbit": {
                target: "https://api.upbit.com",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/upbit/, ""),
            },
        },
    },
});
