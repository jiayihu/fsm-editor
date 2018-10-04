const path = require('path');
const webpack = require('webpack');
const history = require('connect-history-api-fallback');
const convert = require('koa-connect');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');

const IS_DEV = process.env.NODE_ENV !== 'production';

const swConfig = {
  clientsClaim: true,
  skipWaiting: true,
  runtimeCaching: [],
  cacheId: 'fsm-editor'
};
const htmlConfig = {
  template: './index.template.html',
  filename: './index.html',
  favicon: 'favicon.ico'
};
const envConfig = {
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV)
  }
};

const devPlugins = [
  new HtmlWebpackPlugin(htmlConfig),
  new GenerateSW({
    ...swConfig,
    include: [], // Do not precache any static asset in development,
    importScripts: ['sw-dev.js']
  }),
  new webpack.DefinePlugin(envConfig)
];
const prodPlugins = [
  new HtmlWebpackPlugin(htmlConfig),
  new GenerateSW(swConfig),
  new CopyWebpackPlugin([
    { from: './favicon.ico', to: './favicon.ico' },
    { from: './assets', to: './assets' }
  ]),
  new webpack.DefinePlugin(envConfig)
];

module.exports = {
  mode: IS_DEV ? 'development' : 'production',
  serve: {
    dev: {},
    add: app => {
      app.use(convert(history({})));
    }
  },
  devtool: 'eval',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, IS_DEV ? '' : 'public'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  performance: { hints: false },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
      {
        test: /\.html$/,
        use: 'raw-loader',
        include: [path.resolve(__dirname, 'src')]
      }
    ]
  },
  plugins: IS_DEV ? devPlugins : prodPlugins
};
