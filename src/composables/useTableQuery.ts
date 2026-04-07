import { reactive, ref } from 'vue'
import { useCancelableRequest } from '@/composables/useCancelableRequest'

type ListResp<T> = { data: { list: T[]; total: number } }

export function useTableQuery<TQuery extends Record<string, any>, TItem, TResp extends ListResp<TItem>>(options: {
  initialQuery: TQuery
  fetcher: (params: any, signal: AbortSignal) => Promise<TResp>
  defaultPageSize?: number
  toParams?: (query: TQuery, page: number, pageSize: number) => Record<string, any>
}) {
  const query = reactive({ ...options.initialQuery }) as TQuery
  const rows = ref<TItem[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(options.defaultPageSize ?? 10)
  const error = ref<unknown>(null)

  const { run, cancel, loading } = useCancelableRequest(options.fetcher)

  function buildParams() {
    if (options.toParams) return options.toParams(query, page.value, pageSize.value)
    return { ...query, page: page.value, pageSize: pageSize.value }
  }

  async function fetchList(resetPage = false) {
    if (resetPage) page.value = 1
    error.value = null
    cancel()
    try {
      const res = await run(buildParams())
      if (!res) return
      rows.value = res.data.list
      total.value = res.data.total
    } catch (e) {
      error.value = e
      throw e
    }
  }

  function setQuery(patch: Partial<TQuery>) {
    Object.assign(query, patch)
  }

  function resetQuery() {
    Object.assign(query, options.initialQuery)
  }

  function onPageChange(nextPage: number) {
    page.value = nextPage
    fetchList(false)
  }

  function onSizeChange(nextSize: number) {
    pageSize.value = nextSize
    fetchList(true)
  }

  function onSearch() {
    fetchList(true)
  }

  return {
    query,
    rows,
    total,
    page,
    pageSize,
    loading,
    error,
    fetchList,
    setQuery,
    resetQuery,
    onPageChange,
    onSizeChange,
    onSearch,
  }
}
