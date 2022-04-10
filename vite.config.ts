import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// unplugin-vue-components这个插件可以自动导入组件，不需要import导入,elementPlus也用到了它。
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
import { resolve } from 'path'  //用来自定义相对路径
export default defineConfig({
  plugins: [vue(),
  // 引入ElementPlus配置
  AutoImport({
    resolvers: [ElementPlusResolver()],
  }),
  Components({
    resolvers: [ElementPlusResolver()],
    dts: true,
    deep: true,  // 深度匹配 ,对于子路由也有效果
    dirs: ['src/components'] // 在这两个文件下的组件会自动引入
  }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')  //vite 的相对路径的重新配置
    }
  },
  server: {
    open: true   //编译成功自动打开浏览器
  }
})
