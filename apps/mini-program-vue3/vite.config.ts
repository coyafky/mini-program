import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import uniPlugin from '@dcloudio/vite-plugin-uni'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, fileURLToPath(new URL('./env', import.meta.url)))

  return {
    envDir: './env',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: true,
      port: Number.parseInt(env.VITE_APP_PORT || '3002', 10),
      proxy: {
        '/api/v1': {
          target: env.VITE_PROXY_TARGET || 'http://127.0.0.1:3000',
          changeOrigin: true,
        },
      },
    },
    plugins: [typeof uniPlugin === 'function' ? uniPlugin() : uniPlugin.default()],
  }
})
