import { resolve } from 'path';
import { defineConfig } from 'umi';
import { chainWebpack } from './.webpack.config';

export default defineConfig({
  history: { type: 'browser' },
  hash: true,
  ignoreMomentLocale: true,
  publicPath: '/',
  chainWebpack,
  title: '区块链实训教学平台-Fabric BaaS',
  favicon: '/favicon.png',

  theme: {
    'table-header-bg': '#ebedf0'
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
      target: process.env.PROXY_ENDPOINT,
      changeOrigin: true,
      pathRewrite: { '^/api': '' }
    }
  },

  // 用于提供给代码中可用的变量
  define: {
    'process.env.IPFS_LINK': process.env.IPFS_LINK,
    'process.env.FABRIC_BAAS_DASHBOARD': process.env.FABRIC_BAAS_DASHBOARD,
    'process.env.RESOURCE_USAGE_DASHBOARD': process.env.RESOURCE_USAGE_DASHBOARD,
    'process.env.CHAIN_IDE_LINK': process.env.CHAIN_IDE_LINK, // ChainIDE地址
    'process.env.BAAS_BACKEND_LINK': process.env.BAAS_BACKEND_LINK, // BaaS Backend地址
    'process.env.PLATFORM_SSO_AUTH_ENDPOINT': process.env.PLATFORM_SSO_AUTH_ENDPOINT, // SSO认证地址
    'process.env.FABRIC_NODE_EXPLORER': process.env.FABRIC_NODE_EXPLORER,
    'process.env.PROXY_ENDPOINT': process.env.PROXY_ENDPOINT
  }
});
