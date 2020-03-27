const path = require('path');
const webpack = require('webpack');
// const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const merge = require('webpack-merge');

const Components = require('./components.json');
const { alias } = require('./utils');
const { externals } = require('./externals')
const baseConfig = require('./webpack.base.js');

const webpackConfig = {
  mode: 'production',
  entry: { ...Components, index: './packages/index.js' },
  output: {
    path: path.resolve(process.cwd(), './components'),
    publicPath: '/dist/',
    filename: '[name].js',
    chunkFilename: '[id].js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: alias,
    modules: ['node_modules']
  },
  optimization: {
    minimize: false
  },
  externals: externals,
  performance: {
    hints: false // 关闭性能提示
  },
  // externals: config.externals,
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader?minimize=false'
      }
    ]
  },
  plugins: [
    // new ProgressBarPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]
};

module.exports = merge(baseConfig(), webpackConfig);
