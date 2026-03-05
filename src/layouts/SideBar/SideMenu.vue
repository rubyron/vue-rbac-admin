<template>
<div class='sidebar-container'>
<div class='menu-title'>
  <img src="https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png" class="sidebar-logo" />
  <span v-if='appStore.sideBarExpanded'>VUE  SYSTEM</span>
</div>
<el-menu :collapse="isCollapse"
:default-active="$route.path" active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        text-color="#fff" router>
    <SideMenuItem v-for='item in menuTree' :item='item' :key='item.id'/>
  </el-menu>
</div>
  
</template>

<script lang="ts" setup>
import SideMenuItem from './SideMenuItem.vue'
import { useUserStore }from '@/stores/user'
import { useAppStore }from '@/stores/app'
import {useRouter} from 'vue-router'

const router = useRouter();
const userStore= useUserStore()
const appStore= useAppStore()

const isCollapse=computed(()=>{
  return !appStore.sideBarExpanded
})
const menuTree=computed(()=>{
  return userStore.menuTree
})
const handleMenuSelect = (key: string) => {
  console.log('select key',key)
  router.push(key); // 使用 router.push 跳转到菜单项的 path
};

console.log('menuTree',menuTree)
</script>

<style lang="scss" scoped>
.el-menu {
  border-right: none !important;
height:100vh;
overflow:auto
}
.sidebar-container{
  // background:#545c64
}
.menu-title{
  display:flex;
  justify-content:center;
  align-items:center;
  background:#2b2f3a
}

.sidebar-logo{
  width:40px;
  height:40px;
  margin:10px;
}
</style>