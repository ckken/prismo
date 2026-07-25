# Data adapter seam

Keep project-specific transport and field mapping outside the installed UI.

```ts
export type DataQuery = {
  page?: number
  pageSize?: number
  sort?: Array<{ id: string; desc: boolean }>
  filters?: Record<string, string | number | boolean>
}

export interface DataSource<T> {
  load(query: DataQuery, options?: { signal?: AbortSignal }): Promise<{
    items: T[]
    total: number
  }>
}
```

Parse the mapped result with the recipe's Zod schema. Map network, authorization, cancellation, and contract failures to distinct application states. Fixture and REST adapters should pass the same contract tests.
