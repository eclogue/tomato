import {resolve} from "path";

export default {
  // for query-string@6 https://github.com/sorrycc/blog/issues/68
  es5ImcompatibleVersions: true,
  plugins: [
    [
      'umi-plugin-react',
      {
        dva: true,
        antd: true,
        // dynamicImport: {
        //   webpackChunkName: false,
        //   loadingComponent: './components/Loader',
        // },
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
        dll: false,
        pwa: {
          manifestOptions: {
            srcPath: 'src/manifest.json'
          },
        }
      },
    ],
  ],
  theme: "./src/config/theme.config.js",
  // 接口代理示例
  proxy: {
    "/api/dev": {
      "target": "http://127.0.0.1:5000",
      "changeOrigin": true,
      "pathRewrite": { "^/api/dev" : "/api/v1" }
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
  // publicPath: '/public/',
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
