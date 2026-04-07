import { computed, reactive, ref } from 'vue'

export function useLocalTable<TQuery extends Record<string, any>, TItem>(options: {
  initialQuery: TQuery
  source: () => TItem[]
  filter: (items: TItem[], query: TQuery) => TItem[]
  defaultPageSize?: number
}) {
  const query = reactive({ ...options.initialQuery }) as TQuery
  const page = ref(1)
  const pageSize = ref(options.defaultPageSize ?? 10)

  const filteredRows = computed(() => options.filter(options.source(), query))
  const total = computed(() => filteredRows.value.length)
  const rows = computed(() => {
    const start = (page.value - 1) * pageSize.value
    return filteredRows.value.slice(start, start + pageSize.value)
  })

  function setQuery(patch: Partial<TQuery>) {
    Object.assign(query, patch)
  }

  function resetQuery() {
    Object.assign(query, options.initialQuery)
    page.value = 1
  }

  function onSearch() {
    page.value = 1
  }

  function onPageChange(nextPage: number) {
    page.value = nextPage
  }

  function onSizeChange(nextSize: number) {
    pageSize.value = nextSize
    page.value = 1
  }

  return {
    query,
    rows,
    total,
    page,
    pageSize,
    setQuery,
    resetQuery,
    onSearch,
    onPageChange,
    onSizeChange,
  }
}
