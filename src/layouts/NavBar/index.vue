<template>
  <div class="navbar">
  <div class='navbar__left'>
  <HamburgerIcon @toggle-click='toggleSidebar' :isActive='sideBarExpanded'/>
    <Breadcrumb :sideBarExpanded='sideBarExpanded'/>
    </div>
    <div class='right__menu'> 
    <LangSelect class='right__menu__item'/>
    <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          <el-icon :size="12"><CaretBottom /></el-icon>
        </div>

        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/">
              <el-dropdown-item> 首页 </el-dropdown-item>
            </router-link>
            <a target="_blank" href="https://github.com/yisibell/">
              <el-dropdown-item> 项目地址 </el-dropdown-item>
            </a>
            <a target="_blank" href="https://github.com/yisibell/">
              <el-dropdown-item>Docs</el-dropdown-item>
            </a>
            <el-dropdown-item divided @click="logout">
              <span style="display: block"> 退出登录 </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Breadcrumb from './Breadcrumb.vue'
import HamburgerIcon from './HamburgerIcon.vue'
import LangSelect from './LangSelect.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import {useAppStore} from '@/stores/app'

const authStore = useAuthStore()
const appStore = useAppStore()
const router = useRouter()



const toggleSidebar =()=>{
  appStore.toggleSide()
}

const sideBarExpanded = computed(() => appStore.sideBarExpanded)

const logout = async() => {
await authStore.logout()    
router.push('/login')
    ElMessage({
      message: '登出系统',
      type: 'success',
    })
  }
</script>

<style lang='scss' scoped >

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;

  &__left {
    display: flex;
    align-items: center;
  }

  .right__menu {
    height: 100%;
    line-height: 50px;
    display: flex;
    align-items: center;

    &:focus {
      outline: none;
    }
    &__item{
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
    }
  }
}
</style>
