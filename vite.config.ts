import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import ViteFonts from "unplugin-fonts/vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        ViteFonts({
            google: {
                families: [
                    {
                        name: "Lato",
                        styles: "wght@400;700",
                    },
                ],
            },
        }),
    ],
    server: {
        port: 8080,
        proxy: {
            "^/api/.*": {
                target: "http://localhost:3000",
                changeOrigin: true,
            },
        },
    },
});
