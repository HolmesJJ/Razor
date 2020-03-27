const webpack = require('webpack');
const merge = require('webpack-merge');
const portfinder = require('portfinder');

const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { resolve, assetsPath } = require('./utils');
const baseWebpackConfig = require('./webpack.base.js');
const MarkdownLoaderOptions = require('./markdown-loader-option');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

// 开发模式
const mode = 'development';

/**
 * @param {typeof process['env']} webpackEnv
 * @return {Promise<import('webpack').Configuration>}
 */
module.exports = (webpackEnv = {}) => {
  const devWebpackConfig = merge(baseWebpackConfig(Object.assign({}, webpackEnv, { mode })), {
    mode,
    resolve: {
      extensions: ['.md']
    },
    // 入口
    entry: { doc: ['babel-polyfill', resolve('doc/src/main.js')] },
    // 出口
    output: { path: resolve('doc/dist') },
    module: {
      rules: [
        // 把markdown文件转化为vue组件
        {
          test: /\.md$/,
          use: [
            'vue-loader',
            {
              loader: 'vue-markdown-loader/lib/markdown-compiler',
              options: Object.assign(
                { raw: true },
                MarkdownLoaderOptions
              )
            }
          ]
        }
      ]
    },
    // 插件
    plugins: [
      new webpack.NamedModulesPlugin(),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: resolve('doc/src/index.html'),
        inject: true
      }),
      new CopyWebpackPlugin([
        {
          from: resolve('doc/src/assets'),
          to: resolve('doc/dist/assets')
        }
      ]),
      new webpack.HotModuleReplacementPlugin(),
      new ForkTsCheckerWebpackPlugin(
        {
          vue: true,
          tslint: false,
          formatter: 'codeframe',
          checkSyntacticErrors: false
        }
      )
    ],
    // webpack4 打包优化
    // https://webpack.js.org/configuration/optimization/
    optimization: {
      minimize: false,
      runtimeChunk: { name: 'runtime' },
      splitChunks: {
        cacheGroups: {
          // 提取 node_modules 中代码
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          },
          commons: {
            // async 设置提取异步代码中的公用代码
            chunks: 'async',
            name: 'commons-async',
            // minSize 默认为 30000
            // 想要使代码拆分真的按照我们的设置来
            // 需要减小 minSize
            minSize: 0,
            // 至少为两个 chunks 的公用代码
            minChunks: 2
          }
        }
      }
    },
    performance: { hints: false },
    // https://webpack.docschina.org/configuration/devtool/
    // 开发模式下使用 cheap-eval-source-map 方便快速构建和追踪代码
    devtool: '#cheap-eval-source-map',
    watch: webpackEnv.mode === 'development',
    // dev server
    devServer: {
      host: 'localhost',
      hot: true,
      inline: true,
      compress: true,
      open: true,
      quiet: true // necessary for FriendlyErrorsPlugin
    }
  });

  if (webpackEnv.mode === 'production') {
    // mode: production
    devWebpackConfig.mode = webpackEnv.mode;

    // chunkfile
    devWebpackConfig.output = Object.assign(devWebpackConfig.output, {
      filename: assetsPath('js/[name].[hash].js'),
      chunkFilename: assetsPath('js/[name].[hash].js')
    });

    // plugins for production
    devWebpackConfig.plugins = devWebpackConfig.plugins.concat([
      // 压缩css文件
      new OptimizeCSSPlugin({
        cssProcessorOptions: { safe: true }
      }),
      // keep module.id stable when vender modules does not change
      new webpack.HashedModuleIdsPlugin(),
      // enable scope hoisting
      new webpack.optimize.ModuleConcatenationPlugin()
    ]);
  }

  return new Promise((resolve, reject) => {
    // 寻找当前可用的端口
    portfinder.basePort = Number(process.env.PORT) || 8080;
    portfinder.getPort((err, port) => {
      if (err) {
        reject(err);
      } else {
        // publish the new Port, necessary for e2e tests
        process.env.PORT = String(port);
        // add port to devServer config
        devWebpackConfig.devServer.port = port;

        // Add FriendlyErrorsPlugin
        devWebpackConfig.plugins.push(
          new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
              messages: [
                `Your application is running here: http://${
                devWebpackConfig.devServer.host
                }:${port}`
              ],
              notes: []
            }
          })
        );

        resolve(devWebpackConfig);
      }
    });
  });
};
