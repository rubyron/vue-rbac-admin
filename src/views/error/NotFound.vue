<template>
  <div class="not-found">
    <div class="not-found__code">404</div>
    <h1 class="not-found__title">页面不存在</h1>
    <p class="not-found__desc">抱歉，您访问的页面可能已删除、名称已更改，或暂时不可用。</p>
    <RouterLink class="not-found__btn" to="/dashboard">返回首页</RouterLink>
  </div>
</template>

<style scoped lang="scss">
.not-found {
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

.not-found__code {
  font-size: 120px;
  font-weight: 700;
  line-height: 1;
  color: #409eff;
}

.not-found__title {
  margin: 16px 0 8px;
  font-size: 28px;
  font-weight: 600;
}

.not-found__desc {
  margin: 0 0 24px;
  max-width: 560px;
  font-size: 14px;
  color: #606266;
}

.not-found__btn {
  display: inline-block;
  padding: 10px 18px;
  border-radius: 6px;
  background: #409eff;
  color: #fff;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.not-found__btn:hover {
  background: #337ecc;
}
</style>