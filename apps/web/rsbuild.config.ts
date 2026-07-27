import { defineConfig } from "@rsbuild/core"
import { pluginReact } from "@rsbuild/plugin-react"

const assetPrefix = process.env.PUBLIC_BASE_PATH ?? "/"

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: "Shadcn Agent Kit — Dashboard recipes for coding agents",
    meta: {
      description:
        "Choose a dashboard by capability, install editable source, connect real data, and verify the result.",
      "theme-color": "#eef2f5",
    },
  },
  tools: {
    htmlPlugin: (config, { entryName }) => {
      if (entryName === "playground") config.filename = "playground/index.html"
    },
  },
  output: {
    assetPrefix,
    distPath: { root: "dist" },
  },
  source: {
    entry: {
      index: "./src/main.tsx",
      playground: "./src/playground.tsx",
    },
    define: {
      __PUBLIC_BASE_PATH__: JSON.stringify(assetPrefix),
      __PUBLIC_SITE_URL__: JSON.stringify(process.env.PUBLIC_SITE_URL ?? ""),
      __PUBLIC_REPOSITORY_URL__: JSON.stringify(process.env.PUBLIC_REPOSITORY_URL ?? "https://github.com"),
    },
  },
})
