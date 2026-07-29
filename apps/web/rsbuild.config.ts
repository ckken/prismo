import { defineConfig } from "@rsbuild/core"
import { pluginReact } from "@rsbuild/plugin-react"
import { fileURLToPath } from "node:url"

const assetPrefix = process.env.PUBLIC_BASE_PATH ?? "/"
const workspaceModule = (name: string) =>
  fileURLToPath(new URL(`../../node_modules/${name}`, import.meta.url))
const reactPath = workspaceModule("react")
const reactDomPath = workspaceModule("react-dom")

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
  tools: {
    rspack: (config) => {
      // Keep React and React DOM singletons across Bun workspace symlinks.
      // HeroUI v3 uses React 19's `use` API, which fails immediately if a
      // second React module instance is bundled.
      config.resolve ??= {}
      config.resolve.alias = {
        ...config.resolve.alias,
        react: reactPath,
        "react/jsx-runtime": `${reactPath}/jsx-runtime.js`,
        "react/jsx-dev-runtime": `${reactPath}/jsx-dev-runtime.js`,
        "react-dom": reactDomPath,
        "react-dom/client": `${reactDomPath}/client.js`,
      }
    },
  },
})
