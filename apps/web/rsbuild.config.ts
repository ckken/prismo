import { defineConfig } from "@rsbuild/core"
import { pluginReact } from "@rsbuild/plugin-react"

const assetPrefix = process.env.PUBLIC_BASE_PATH ?? "/"

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: "Agenic — agent-first UI delivery with proof",
    meta: {
      description:
        "Turn intent into an agent-ready UI delivery plan, editable source, and verifiable proof.",
      "theme-color": "#111827",
    },
  },
  output: {
    assetPrefix,
    distPath: { root: "dist" },
  },
  source: {
    entry: {
      index: "./src/main.tsx",
    },
    define: {
      __PUBLIC_BASE_PATH__: JSON.stringify(assetPrefix),
      __PUBLIC_SITE_URL__: JSON.stringify(process.env.PUBLIC_SITE_URL ?? ""),
      __PUBLIC_REPOSITORY_URL__: JSON.stringify(process.env.PUBLIC_REPOSITORY_URL ?? "https://github.com"),
    },
  },
})
