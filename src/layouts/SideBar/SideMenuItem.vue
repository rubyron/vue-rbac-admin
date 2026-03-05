<template>
  <el-sub-menu :index='item.path'  v-if='item.children && item.children.length>0'>
    <template #title>
      <el-icon><location /></el-icon>
      <span>{{item.name}}</span>
    </template>
    <SideMenuItem v-for='subItem in item.children' :key='subItem.id' :item='subItem'/>
  </el-sub-menu>
  <el-menu-item :index='item.path' v-else :route='item.path'>
    <el-icon><location /></el-icon>
    <span>{{item.name}}</span>
  </el-menu-item>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue'
import type {MenuItem} from '@/types/menu'
const props=defineProps({
  item:{
  type:Object as PropType<MenuItem>,
  required:true}

})
const {item} = toRefs(props)

</script>
