import {resolve} from "path";

export default {
  ignoreMomentLocale: true,
  targets: { ie: 9 },
  treeShaking: true,
  plugins: [
    [
      'umi-plugin-react',
      {
        dva: { immer: true },
        antd: true,
        dynamicImport: {
          webpackChunkName: true,
          loadingComponent: './components/Loader',
        },
        routes: {
          exclude: [
            /model\.(j|t)sx?$/,
            /service\.(j|t)sx?$/,
            /models\//,
            /components\//,
            /services\//,
          ],
        },
        dll: {
          exclude: [],
          include: ["dva", "dva/router", "dva/saga", "dva/fetch", "antd/es"],
        },
        pwa: {
          manifestOptions: {
            srcPath: 'manifest.json'
          },
        }
      },
    ],
  ],
  theme: "./src/config/theme.config.js",
  // 接口代理示例
  proxy: {
    "/api/v1/weather": {
      "target": "https://api.seniverse.com/",
      "changeOrigin": true,
      "pathRewrite": { "^/api/v1/weather": "/v3/weather" }
    },
    "/api/v3": {
      "target": "http://127.0.0.1:5000",
      "changeOrigin": true,
      "pathRewrite": { "^/api/v3" : "/admin" }
    },
    "/api/v4": {
      "target": "http://127.0.0.1:5000",
      "changeOrigin": true,
      "pathRewrite": { "^/api/v4" : "/" }
    }
  },
  alias: {
    themes: resolve(__dirname, './src/themes'),
    components: resolve(__dirname, "./src/components"),
    utils: resolve(__dirname, "./src/utils"),
    config: resolve(__dirname, "./src/utils/config"),
    enums: resolve(__dirname, "./src/utils/enums"),
    services: resolve(__dirname, "./src/services"),
    models: resolve(__dirname, "./src/models"),
    routes: resolve(__dirname, "./src/routes"),
  },
  urlLoaderExcludes: [
    /\.svg$/,
  ],
  ignoreMomentLocale: true,
  chainWebpack(config) {
    config.module.rule('svg')
      .test(/\.svg$/i)
      .use('svg-sprite-loader')
      .loader(require.resolve('svg-sprite-loader'));
  },
  history: 'hash',
  base: '/',
  outputPath: '/public/',
  singular: false,
  publicPath: '/',
  runtimePublicPath: true,
  // extraBabelPresets: ['@lingui/babel-preset-react'],
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'lodash',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'lodash',
    ],
  ],
}
