<template>
  <div class="base-permission-tree">
    <div class="base-permission-tree__head">
      <slot name="title">
        <span class="base-permission-tree__title">菜单分配</span>
      </slot>
      <div class="base-permission-tree__tools">
        <el-input
          v-model="innerFilterText"
          placeholder="搜索权限"
          clearable
          :prefix-icon="Search"
          class="base-permission-tree__filter"
        />
        <el-button :disabled="disabled" @click="selectAll">全选</el-button>
        <el-button :disabled="disabled" @click="clearAll">清空</el-button>
      </div>
    </div>

    <div class="base-permission-tree__meta">
      <span>已选 {{ checkedCount }} 项</span>
    </div>

    <BaseTree
      ref="treeRef"
      :data="data"
      :node-key="nodeKey"
      :tree-props="treeProps"
      :show-checkbox="true"
      :default-expand-all="defaultExpandAll"
      :highlight-current="highlightCurrent"
      :disabled="disabled"
      :checked-keys="checkedKeys"
      :filter-text="innerFilterText"
      :filter-node-method="filterNodeMethod"
      :empty-text="emptyText"
      @check-change="emitSelection"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import BaseTree from '@/components/tree/BaseTree.vue'

type TreeNode = Record<string, any>

const props = withDefaults(
  defineProps<{
    data: TreeNode[]
    nodeKey?: string
    treeProps?: { label?: string; children?: string; disabled?: string }
    checkedKeys?: Array<string | number>
    disabled?: boolean
    defaultExpandAll?: boolean
    highlightCurrent?: boolean
    emptyText?: string
    filterText?: string
    filterNodeMethod?: (value: string, data: TreeNode, node: unknown) => boolean
    allLeafKeys?: Array<string | number>
  }>(),
  {
    nodeKey: 'id',
    treeProps: () => ({ label: 'label', children: 'children' }),
    checkedKeys: () => [],
    disabled: false,
    defaultExpandAll: true,
    highlightCurrent: true,
    emptyText: '暂无权限数据',
    filterText: '',
    filterNodeMethod: undefined,
    allLeafKeys: () => [],
  }
)

const emit = defineEmits<{
  (e: 'update:filterText', value: string): void
  (e: 'selection-change', nodes: any[]): void
}>()

const treeRef = ref<InstanceType<typeof BaseTree>>()
const innerFilterText = ref(props.filterText)

watch(
  () => props.filterText,
  (val) => {
    innerFilterText.value = val
  }
)
watch(innerFilterText, (val) => emit('update:filterText', val))

const checkedCount = computed(() => {
  const nodes = treeRef.value?.getCheckedNodes(false, false) ?? []
  return nodes.length
})

function emitSelection() {
  const nodes = treeRef.value?.getCheckedNodes(false, false) ?? []
  emit('selection-change', nodes)
}

function selectAll() {
  treeRef.value?.setCheckedKeys(props.allLeafKeys)
  emitSelection()
}

function clearAll() {
  treeRef.value?.setCheckedKeys([])
  emitSelection()
}

function getCheckedNodes(leafOnly = false, includeHalfChecked = false) {
  return treeRef.value?.getCheckedNodes(leafOnly, includeHalfChecked) ?? []
}

function setCheckedKeys(keys: Array<string | number>) {
  treeRef.value?.setCheckedKeys(keys)
}

defineExpose({
  getCheckedNodes,
  setCheckedKeys,
})
</script>

<style scoped lang="scss">
.base-permission-tree__head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 8px;
}

.base-permission-tree__title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.base-permission-tree__tools {
  display: flex;
  align-items: center;
  gap: 8px;
}

.base-permission-tree__filter {
  width: 220px;
}

.base-permission-tree__meta {
  margin-bottom: 8px;
  font-size: 12px;
  color: #909399;
}
</style>
