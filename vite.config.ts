import {defineConfig} from "vite"
import {SvelteKitPWA} from "@vite-pwa/sveltekit"
// noinspection ES6PreferShortImport
import {themeColor} from "./src/lib/style/theme.server"
import {sveltekit} from "@sveltejs/kit/vite"

export default defineConfig({
  plugins: [
    sveltekit(),
    SvelteKitPWA({
      kit: {
        trailingSlash: "always",
      },
      scope: "/",
      base: "/",
      includeAssets: ["favicon.png"],
      workbox: {
        globPatterns: ["**/*.{js,css,html,woff2,json,csv,png,svg}"],
      },
      manifest: {
        name: "dot i/o",
        id: "dot_io_v2",
        theme_color: themeColor,
        icons: [
          {
            src: "icon.svg",
            sizes: "144x144",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
})