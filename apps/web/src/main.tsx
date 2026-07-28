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
import { CatalogPage, DashboardLayout, DashboardPage, WorkflowPage } from "./App"
import { AgenicHomePage } from "./agenic-home"
import { isDashboardId, type DashboardId } from "./dashboard-site-data"
import { applyInitialPreferences } from "./preferences"
import "./styles.css"
import "./home.css"

applyInitialPreferences()

const rootRoute = createRootRoute({ component: () => <Outlet /> })
const dashboardLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "dashboard-layout",
  component: DashboardLayout,
})
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: AgenicHomePage,
})
const dashboardRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/dashboard/$dashboardId",
  beforeLoad: ({ params }) => {
    if (!isDashboardId(params.dashboardId)) {
      throw redirect({ to: "/dashboard/$dashboardId", params: { dashboardId: "default" } })
    }
  },
  component: DashboardRoute,
})
const catalogRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/catalog",
  component: CatalogPage,
})
const workflowRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/workflow",
  component: WorkflowPage,
})

function DashboardRoute() {
  const { dashboardId } = dashboardRoute.useParams()
  return <DashboardPage dashboardId={dashboardId as DashboardId} />
}

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardLayoutRoute.addChildren([dashboardRoute, catalogRoute, workflowRoute]),
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
