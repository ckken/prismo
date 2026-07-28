import { defineConfig } from "@rsbuild/core"
import { pluginReact } from "@rsbuild/plugin-react"

const assetPrefix = process.env.PUBLIC_BASE_PATH ?? "/"

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: "Prismo — verifiable UI delivery for coding agents",
    meta: {
      description:
        "Turn intent into reviewable, editable UI source with a local CLI and proof boundary.",
      "theme-color": "#6542ec",
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
