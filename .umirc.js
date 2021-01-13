import { resolve } from 'path';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

const chainWebpack = (config, { webpack }) => {
  config.plugin('monaco-editor').use(MonacoWebpackPlugin, [
    {
      languages: ['json']
    }
  ])
};
export default {
  history: { type: 'hash' },
  hash: true,
  ignoreMomentLocale: true,
  publicPath: './',
  chainWebpack,
  title: 'BaaS',

  alias: {
    components: resolve(__dirname, './src/components'),
    models: resolve(__dirname, './src/models'),
    services: resolve(__dirname, './src/services'),
    utils: resolve(__dirname, './src/utils'),
    themes: resolve(__dirname, './src/themes'),
    assets: resolve(__dirname, './src/assets'),
    wrappers: resolve(__dirname, './src/pages/wrappers/'),
  },

  externals: {
    echarts: 'window.echarts',
    konva: 'window.konva',
  },
  scripts: [
    'http://echarts.baidu.com/build/dist/echarts.js',
    'https://cdnjs.cloudflare.com/ajax/libs/konva/7.2.2/konva.min.js'
  ],

  proxy: {
    '/api': {
      // target: 'http://192.168.8.34:3000',
      target: 'http://161.189.217.169:3000',
      changeOrigin: false,
      pathRewrite: { '^/api': '' },
    },
  },

  // 用于提供给代码中可用的变量
  define: {
    'process.env.CHAIN_IDE_LINK': 'https://161.189.217.169:9601', // ChainIDE地址
    'process.env.BAAS_BACKEND_LINK': 'http://161.189.217.169:3000', // BaaS Backend地址
  }
} 