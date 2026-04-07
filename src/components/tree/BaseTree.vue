<template>
  <div class="base-tree">
    <slot name="header" />

    <el-tree
      v-if="data.length"
      ref="innerTreeRef"
      class="base-tree__inner"
      :data="data"
      :node-key="nodeKey"
      :props="treeProps"
      :show-checkbox="showCheckbox"
      :default-expand-all="defaultExpandAll"
      :highlight-current="highlightCurrent"
      :disabled="disabled"
      :filter-node-method="filterNodeMethod"
      @check="onCheck"
      @check-change="onCheckChange"
      @current-change="onCurrentChange"
    />

    <el-empty v-else :description="emptyText" :image-size="64">
      <slot name="empty" />
    </el-empty>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { ElTree } from 'element-plus'

type TreeNode = Record<string, any>

const props = withDefaults(
  defineProps<{
    data: TreeNode[]
    nodeKey?: string
    treeProps?: { label?: string; children?: string; disabled?: string }
    showCheckbox?: boolean
    defaultExpandAll?: boolean
    highlightCurrent?: boolean
    disabled?: boolean
    checkedKeys?: Array<string | number>
    filterText?: string
    filterNodeMethod?: (value: string, data: TreeNode, node: unknown) => boolean
    emptyText?: string
  }>(),
  {
    nodeKey: 'id',
    treeProps: () => ({ label: 'label', children: 'children' }),
    showCheckbox: false,
    defaultExpandAll: false,
    highlightCurrent: false,
    disabled: false,
    checkedKeys: () => [],
    filterText: '',
    filterNodeMethod: undefined,
    emptyText: '暂无数据',
  }
)

const emit = defineEmits<{
  (e: 'check', data: TreeNode, info: unknown): void
  (e: 'check-change', data: TreeNode, checked: boolean, indeterminate: boolean): void
  (e: 'current-change', data: TreeNode | null, node: unknown): void
}>()

const innerTreeRef = ref<InstanceType<typeof ElTree>>()

watch(
  () => props.filterText,
  (val) => {
    if (!innerTreeRef.value) return
    innerTreeRef.value.filter(val || '')
  }
)

watch(
  () => props.checkedKeys,
  (keys) => {
    if (!innerTreeRef.value) return
    nextTick(() => {
      innerTreeRef.value?.setCheckedKeys(keys as Array<string | number>)
    })
  },
  { deep: true, immediate: true }
)

function onCheck(data: TreeNode, info: unknown) {
  emit('check', data, info)
}
function onCheckChange(data: TreeNode, checked: boolean, indeterminate: boolean) {
  emit('check-change', data, checked, indeterminate)
}
function onCurrentChange(data: TreeNode | null, node: unknown) {
  emit('current-change', data, node)
}

function getCheckedNodes(leafOnly = false, includeHalfChecked = false) {
  return innerTreeRef.value?.getCheckedNodes(leafOnly, includeHalfChecked) ?? []
}

function setCheckedKeys(keys: Array<string | number>) {
  innerTreeRef.value?.setCheckedKeys(keys)
}

function filter(val: string) {
  innerTreeRef.value?.filter(val)
}

defineExpose({
  getCheckedNodes,
  setCheckedKeys,
  filter,
})
</script>

<style scoped lang="scss">
.base-tree__inner {
  max-height: calc(100vh - 280px);
  overflow: auto;
  padding: 8px 0;
}
</style>
