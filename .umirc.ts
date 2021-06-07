import { resolve } from 'path';
import { defineConfig } from 'umi';
import { chainWebpack } from './.webpack.config';

export default defineConfig({
  history: { type: 'browser' },
  hash: true,
  ignoreMomentLocale: true,
  publicPath: '/',
  chainWebpack,
  title: 'BaaS',
  favicon: '/favicon.png',

  antd: {
    dark: true // 开启暗色主题
  },

  alias: {
    '~/pages': resolve(__dirname, './src/pages'),
    '~/components': resolve(__dirname, './src/components'),
    '~/models': resolve(__dirname, './src/models'),
    '~/services': resolve(__dirname, './src/services'),
    '~/utils': resolve(__dirname, './src/utils'),
    '~/assets': resolve(__dirname, './src/assets'),
    '~/locales': resolve(__dirname, './src/locales'),
    public: resolve(__dirname, './public'),
    iconfont: resolve(__dirname, './src/assets/iconfont'),
    themes: resolve(__dirname, './src/themes'),
    wrappers: resolve(__dirname, './src/pages/wrappers/')
  },

  locale: {
    default: 'zh-CN',
    antd: false,
    title: false,
    baseNavigator: true,
    baseSeparator: '-'
  },

  externals: {
    echarts: 'window.echarts'
  },
  scripts: ['https://cdnjs.cloudflare.com/ajax/libs/echarts/5.0.0/echarts.min.js'],

  proxy: {
    '/api': {
      target: process.env.API_ENDPOINT || 'http://yzjszjr-chainbaas-api.test.chainide.cn',
      changeOrigin: false,
      pathRewrite: { '^/api': '' }
    }
  },

  // 用于提供给代码中可用的变量
  define: {
    'process.env.IPFS_LINK': process.env.IPFS_LINK,
    'process.env.FABRIC_BAAS_DASHBOARD': process.env.FABRIC_BAAS_DASHBOARD,
    'process.env.RESOURCE_USAGE_DASHBOARD': process.env.RESOURCE_USAGE_DASHBOARD,
    'process.env.CHAIN_IDE_LINK': process.env.CHAIN_IDE_LINK, // ChainIDE地址
    'process.env.BAAS_BACKEND_LINK': process.env.BAAS_BACKEND_LINK // BaaS Backend地址
  }
});
