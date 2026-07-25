# Table boundaries

| Level | Use it for | Included | Move to application/backend when |
|---|---|---|---|
| L0 | Static summary | Render rows, responsive overflow | Sorting, filtering, selection are required |
| L1 | Normal managed list | Client sort/filter/page, column visibility, row selection | Dataset or workflow outgrows browser memory |
| L2 | Server-controlled operations | Controlled page/sort/filter state, request cancellation, total count | Permissions, exports, jobs, audit, or cross-page selection appear |

shadcn/ui supplies presentational building blocks. TanStack Table supplies headless table state. The application owns transport, cache policy, authorization, mutations, export jobs, virtualization strategy, audit, and durable cross-page selection.
