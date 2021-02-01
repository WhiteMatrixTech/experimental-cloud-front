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
  history: { type: 'browser' },
  hash: true,
  ignoreMomentLocale: true,
  publicPath: '/',
  chainWebpack,
  title: 'BaaS',
  favicon: 'https://fabric-baas-front.oss-cn-shanghai.aliyuncs.com/favicon.png',

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
    'https://cdnjs.cloudflare.com/ajax/libs/echarts/5.0.0/echarts.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/konva/7.2.2/konva.min.js'
  ],

  proxy: {
    '/api': {
      target: 'http://yzjszjr-chainbaas-api.test.chainide.cn',
      changeOrigin: false,
      pathRewrite: { '^/api': '' },
    },
  },

  // 用于提供给代码中可用的变量
  define: {
    'process.env.CHAIN_IDE_LINK': 'https://fabric.test.chainide.cn/project/welcome', // ChainIDE地址
    'process.env.BAAS_BACKEND_LINK': 'https://yzjszjr-chainbaas-api.test.chainide.cn', // BaaS Backend地址
  }
} 