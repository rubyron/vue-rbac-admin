<template>
  <el-card shadow="never" class="base-table">
    <div v-if="$slots.toolbar" class="base-table__toolbar">
      <slot name="toolbar" />
    </div>

    <el-table
      v-loading="loading"
      :data="data"
      :stripe="stripe"
      :border="border"
      :row-key="rowKey"
      style="width: 100%"
    >
      <slot />
      <template v-if="$slots.empty" #empty>
        <slot name="empty" />
      </template>
    </el-table>

    <div v-if="showPagination" class="base-table__footer">
      <el-pagination
        :current-page="page"
        background
        layout="total, prev, pager, next, sizes"
        :total="total"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        @current-change="onPageChange"
        @size-change="onSizeChange"
      />
    </div>
  </el-card>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    data: any[]
    loading?: boolean
    total?: number
    page?: number
    pageSize?: number
    pageSizes?: number[]
    showPagination?: boolean
    stripe?: boolean
    border?: boolean
    rowKey?: string
  }>(),
  {
    loading: false,
    total: 0,
    page: 1,
    pageSize: 10,
    pageSizes: () => [10, 20, 50],
    showPagination: true,
    stripe: true,
    border: true,
    rowKey: '',
  }
)

const emit = defineEmits<{
  (e: 'page-change', page: number): void
  (e: 'size-change', size: number): void
}>()

function onPageChange(page: number) {
  emit('page-change', page)
}

function onSizeChange(size: number) {
  emit('size-change', size)
}
</script>

<style scoped lang="scss">
.base-table__toolbar {
  margin-bottom: 12px;
}

.base-table__footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
