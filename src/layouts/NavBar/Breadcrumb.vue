<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: item.path }" v-for='item in breadcrumbs' :key='item.path'>{{item.title}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
import {useRoute} from 'vue-router'
const route = useRoute()
const breadcrumbs = computed(() => {
  return route.matched
    .filter(r => r.meta?.title)
    .map(r => ({
      title: r.meta.title,
      path: r.path
    }))
})

console.log('breadcrumbs',route,breadcrumbs)


</script>
