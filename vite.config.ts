import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import AutoImport from 'unplugin-auto-import/vite';
import { viteMockServe } from 'vite-plugin-mock'


// const isMock = import.meta.env.VITE_USE_MOCK === 'true';
//console.log('isMock', import.meta)

// https://vite.dev/config/
export default defineConfig(({command,mode})=>{
   // 读取 .env、.env.development、.env.production 等
  const env = loadEnv(mode, process.cwd(), '') // 第三个参数 '' 表示不过滤前缀，全部读进来
  const isMock = (env.VITE_USE_MOCK ?? '').toLowerCase() === 'true'
  return{
  plugins: [
    vue(),
    vueDevTools(),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts', // 自动按需引入 Element Plus 组件及其样式文件（如果需要）
    }),
    AutoImport({
      imports: ['vue', 'vue-router','pinia'], // 自动导入 Vue 相关 API 等（可选）
      dts: 'src/auto-imports.d.ts',
      resolvers: [ElementPlusResolver()], // 同时处理 Element Plus 的 API 导入（可选）
    }),
    viteMockServe({
      mockPath: 'mock',
      enable: isMock, // 开发环境开启
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    preprocessorOptions: {
      sass: {
        // 如果你需要自定义Sass选项，可以在这里进行配置
        // 例如：向所有Sass加载器传递共享的全局变量
        additionalData: `@use "@/assets/styles/variables.scss" as *;`,
        // javascriptEnabled: true,

      }
    }
  }
}
})
