<template>
  <div class="no-permission">
    <div class="no-permission__code">403</div>
    <h1 class="no-permission__title">无权访问</h1>
    <p class="no-permission__desc">抱歉，您当前没有访问该页面的权限，请联系管理员开通权限。</p>
    <div class="no-permission__actions">
      <button class="no-permission__btn no-permission__btn--ghost" type="button" @click="goBack">
        返回上一页
      </button>
      <RouterLink class="no-permission__btn" to="/dashboard">返回首页</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<style scoped lang="scss">
.no-permission {
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
  background: #f5f7fa;
  color: #303133;
}

.no-permission__code {
  font-size: 120px;
  font-weight: 700;
  line-height: 1;
  color: #e6a23c;
}

.no-permission__title {
  margin: 16px 0 8px;
  font-size: 28px;
  font-weight: 600;
}

.no-permission__desc {
  margin: 0 0 24px;
  max-width: 560px;
  font-size: 14px;
  color: #606266;
}

.no-permission__actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.no-permission__btn {
  display: inline-block;
  padding: 10px 18px;
  border-radius: 6px;
  border: none;
  background: #409eff;
  color: #fff;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.no-permission__btn:hover {
  background: #337ecc;
}

.no-permission__btn--ghost {
  border: 1px solid #dcdfe6;
  background: #fff;
  color: #606266;
}

.no-permission__btn--ghost:hover {
  border-color: #c0c4cc;
  background: #f2f6fc;
  color: #303133;
}
</style>
