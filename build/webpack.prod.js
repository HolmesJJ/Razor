const merge = require('webpack-merge');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { resolve, assetsPath, replaceLoader } = require('./utils');
const baseWebpackConfig = require('./webpack.base.js');

const mode = 'production';

/**
 * @param {typeof process['env']} webpackEnv
 * @return {import('webpack').Configuration}
 */
module.exports = (webpackEnv = {}) => replaceLoader(merge(baseWebpackConfig(Object.assign(webpackEnv, { mode })), {
  mode,
  entry: {
    main: resolve('packages/index.js'),
  },
  output: {
    path: resolve('dist'),
    filename: '[name].min.js',
    library: 'razor',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  externals: {
    vue: {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue'
    }
  },

  performance: false,
  // Without compression
  optimization: {
    minimize: false
  },
  plugins: [
    // 单独抽离页面样式
    new MiniCssExtractPlugin({
      filename: assetsPath('styles/[name].[chunkhash].css'),
      chunkFilename: assetsPath('styles/[id].[chunkhash].css')
    })
  ]
}), 'style-loader', MiniCssExtractPlugin.loader);
