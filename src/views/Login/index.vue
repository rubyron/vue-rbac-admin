<template>
  <div class="login-page">
    <div class="card">
      <h2 class="title">Admin Login</h2>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        size="large"
        @keyup.enter="onSubmit"
      >
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名" autocomplete="username" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            placeholder="密码"
            show-password
            type="password"
            autocomplete="current-password"
          />
        </el-form-item>

        <div class="row">
          <el-checkbox v-model="form.remember">记住我</el-checkbox>
          <el-link type="primary" :underline="false" @click.prevent>忘记密码</el-link>
        </div>

        <el-button
          type="primary"
          class="btn"
          :loading="loading"
          @click="onSubmit"
        >
          登录
        </el-button>

        <div class="tips">
          测试账号[full access]：admin / 123456
        </div>
        <div class="tips">
          测试账号[limit access]：user / 123456
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
// import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAuthStore }from '@/stores/auth'
import type {LoginForm} from '@/types/login'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const authStore= useAuthStore()

const formRef = ref<FormInstance | null>(null)
const loading = ref(false)

const form = reactive<LoginForm>({
  username: 'admin',
  password: '123456',
  remember: true,
})

const rules: FormRules<LoginForm> = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 32, message: '长度 2-32', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 64, message: '长度 6-64', trigger: 'blur' },
  ],
}

const onSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid:boolean) => {
    if (!valid) return

    loading.value = true
    try {
      await authStore.login({
        username: form.username.trim(),
        password: form.password,
        remember: form.remember,
      })

      ElMessage.success('登录成功')
      const redirect = '/dashboard'
      console.log('route',route,redirect)
      await router.replace(redirect)
    } catch (e: any) {
      ElMessage.error(e?.message || '登录失败')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  padding: 24px;
}
.card {
  width: 380px;
  background: #fff;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 12px 24px rgba(0,0,0,.06);
}
.title {
  margin: 0 0 18px;
  font-size: 22px;
  font-weight: 600;
  text-align: center;
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 6px 0 14px;
}
.btn {
  width: 100%;
}
.tips {
  margin-top: 12px;
  font-size: 12px;
  color: #909399;
  text-align: center;
}
</style>
