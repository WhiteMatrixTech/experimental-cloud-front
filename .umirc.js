import { resolve } from 'path';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
const isEnvProduction = process.env.NODE_ENV === 'production';
const assetDir = 'static';

const chainWebpack = (config, { webpack }) => {
  config.plugin('monaco-editor').use(MonacoWebpackPlugin, [
    {
      languages: ['json', 'text'],
    },
  ]);

  // 修改js，js chunk文件输出目录
  config.output
    .filename(assetDir + '/js/[name].[hash:8].js')
    .chunkFilename(assetDir + '/js/[name].[contenthash:8].chunk.js');

  // 修改css输出目录
  config.plugin('extract-css').tap(() => [
    {
      filename: `${assetDir}/css/[name].[contenthash:8].css`,
      chunkFilename: `${assetDir}/css/[name].[contenthash:8].chunk.css`,
      ignoreOrder: true,
    },
  ]);

  // 修改图片输出目录
  config.module
    .rule('images')
    .test(/\.(png|jpe?g|gif|webp|ico)(\?.*)?$/)
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .tap((options) => {
      const newOptions = {
        ...options,
        name: assetDir + '/img/[name].[hash:8].[ext]',
        fallback: {
          ...options.fallback,
          options: {
            name: assetDir + '/img/[name].[hash:8].[ext]',
            esModule: false,
          },
        },
      };
      return newOptions;
    });

  // 修改svg输出目录
  config.module
    .rule('svg')
    .test(/\.(svg)(\?.*)?$/)
    .use('file-loader')
    .loader(require.resolve('file-loader'))
    .tap((options) => ({
      ...options,
      name: assetDir + '/img/[name].[hash:8].[ext]',
    }));

  // 修改fonts输出目录
  config.module
    .rule('fonts')
    .test(/\.(eot|woff|woff2|ttf)(\?.*)?$/)
    .use('file-loader')
    .loader(require.resolve('file-loader'))
    .tap((options) => ({
      ...options,
      name: assetDir + '/fonts/[name].[hash:8].[ext]',
      fallback: {
        ...options.fallback,
        options: {
          name: assetDir + '/fonts/[name].[hash:8].[ext]',
          esModule: false,
        },
      },
    }));

  // 代码压缩
  config.when(isEnvProduction, (config) => {
    config.merge({
      optimization: {
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          minChunks: 3,
          automaticNameDelimiter: '.',
          cacheGroups: {
            vendor: {
              name: 'vendors',
              test({ resource }) {
                return /[\\/]node_modules[\\/]/.test(resource);
              },
              priority: 10,
            },
          },
        },
      },
    });
  });
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
    locales: resolve(__dirname, './src/locales'),
    wrappers: resolve(__dirname, './src/pages/wrappers/'),
  },

  locale: {
    default: 'zh-CN',
    antd: false,
    title: false,
    baseNavigator: true,
    baseSeparator: '-',
  },

  externals: {
    echarts: 'window.echarts',
  },
  scripts: ['https://cdnjs.cloudflare.com/ajax/libs/echarts/5.0.0/echarts.min.js'],

  proxy: {
    '/api': {
      target: process.env.API_ENDPOINT || 'http://yzjszjr-chainbaas-api.test.chainide.cn',
      changeOrigin: false,
      pathRewrite: { '^/api': '' },
    },
  },

  // 用于提供给代码中可用的变量
  define: {
    'process.env.FABRIC_BAAS_DASHBOARD': process.env.FABRIC_BAAS_DASHBOARD,
    'process.env.CHAIN_IDE_LINK': process.env.CHAIN_IDE_LINK || 'https://fabric.test.chainide.cn/project/welcome', // ChainIDE地址
    'process.env.BAAS_BACKEND_LINK': process.env.BAAS_BACKEND_LINK || 'https://yzjszjr-chainbaas-api.test.chainide.cn', // BaaS Backend地址
  },
};
