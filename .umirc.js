import { resolve } from 'path';
export default {
  history: { type: 'hash' },
  hash: true,
  ignoreMomentLocale: true,
  publicPath: './',

  title: 'BaaS',
  // routes: {
  //   exclude: [
  //     /models\//,
  //     /services\//,
  //     /model\.(t|j)sx?$/,
  //     /service\.(t|j)sx?$/,
  //     /components\//,
  //     /Components\//,
  //   ],
  // },

  alias: {
    components: resolve(__dirname, './src/components'),
    models: resolve(__dirname, './src/models'),
    services: resolve(__dirname, './src/services'),
    utils: resolve(__dirname, './src/utils'),
    themes: resolve(__dirname, './src/themes'),
    assets: resolve(__dirname, './src/assets'),
    wrappers: resolve(__dirname, './src/pages/wrappers/'),
  },

  proxy: {
    '/api': {
      target: 'http://52.81.104.180:3000',
      // target: 'http://192.168.8.5:3000',
      changeOrigin: false,
      pathRewrite: { '^/api': '' },
    },
  },
};
