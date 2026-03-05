<template>
  <div class="layout-default">
    <div class="layout-default__container">
      <div class="layout-default__aside" :style="asideCSSVars">
        <SideBar />
      </div>

      <div class="layout-default__main fixed-header" >
        <div class="layout-default__header">
          <NavBar />
        </div>
        <AppMain />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
  import SideBar from './SideBar/index.vue'
  import NavBar from './NavBar/index.vue'
  import AppMain from './AppMain.vue'
import {useAppStore} from '@/stores/app'

const appStore=useAppStore()
  const asideCSSVars = computed(() => ({
    // '--layout-aside-width': appStore.sideBarExpanded.value?'210px':'64px'
  }))

</script>


<style lang='scss' scoped>
  .layout-default {
    &__container {
      display: flex;
      height: 100vh;
    }

    &__aside {
      width: var(--layout-aside-width);
      min-height: 100%;
      overflow-x: hidden;
      overflow-y: hidden;
      transition: width 0.3s ease;
    }

    &__main {
      flex: 1;
      overflow-x: hidden;
      overflow-y: auto;

      &.fixed-header {
        overflow-y: hidden;
      }
    }
  }

</style>
