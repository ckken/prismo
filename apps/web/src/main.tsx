import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  createBrowserHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
  RouterProvider,
} from "@tanstack/react-router"
import { AgenicHomePage } from "./agenic-home"
import { AgenicCatalogPage, AgenicWorkflowPage } from "./agenic-pages"
import { HeroDashboardPage } from "./hero-dashboard"
import { isDashboardId, type DashboardId } from "./dashboard-site-data"
import { applyInitialPreferences } from "./preferences"
import "./styles.css"

applyInitialPreferences()

const rootRoute = createRootRoute({ component: () => <Outlet /> })
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: AgenicHomePage,
})
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/$dashboardId",
  beforeLoad: ({ params }) => {
    if (!isDashboardId(params.dashboardId)) {
      throw redirect({ to: "/dashboard/$dashboardId", params: { dashboardId: "default" } })
    }
  },
  component: HeroDashboardRoute,
})
const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalog",
  component: AgenicCatalogPage,
})
const workflowRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/workflow",
  component: AgenicWorkflowPage,
})

function HeroDashboardRoute() {
  const { dashboardId } = dashboardRoute.useParams()
  return <HeroDashboardPage dashboardId={dashboardId as DashboardId} />
}

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  catalogRoute,
  workflowRoute,
])
const router = createRouter({
  routeTree,
  history: createBrowserHistory(),
  basepath: __PUBLIC_BASE_PATH__,
})
const queryClient = new QueryClient()

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

const root = document.getElementById("root")

if (!root) throw new Error("Missing #root element")

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
