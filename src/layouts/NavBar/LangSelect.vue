<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div class="international-icon-wrapper">
    <i>
       <LanguageIcon/>
       </i>
    </div>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :disabled="language === 'zh'" command="zh"> 中文 </el-dropdown-item>
        <el-dropdown-item :disabled="language === 'en'" command="en"> English </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
  // import { useAppStore } from '@/stores/app'
  import {
    computed
  } from 'vue'
  import {
    setLocale,
    type LocaleType
  } from '@/plugins/i18n'
  import LanguageIcon from '@/components/icons/IconLanguage.vue'

  // const AppStore = useAppStore()

  // const language = computed(() => AppStore.language)
  const language = ref < LocaleType > ('zh')

  const handleSetLanguage = (lang: LocaleType) => {
    setLocale(lang)

    // AppStore.setLanguage(lang)

    ElMessage({
      message: 'Switch Language Success',
      type: 'success',
    })
  }

</script>

<style lang="scss" scoped>
  .international-icon-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  i {
  display: flex;
  place-items: center;
  place-content: center;
  width: 32px;
  height: 32px;

  color: var(--color-text);
}

</style>
