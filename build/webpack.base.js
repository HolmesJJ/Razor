const webpack = require('webpack');

const { VueLoaderPlugin } = require('vue-loader');

const { resolve, assetsPath, alias } = require('./utils');
/**
 * @param {typeof process['env']} webpackEnv
 * @return {import('webpack').Configuration}
 */
module.exports = (webpackEnv) => {
  // const isProd = webpackEnv.mode === 'production';

  return {
    // 设置webpack context为项目根目录
    context: resolve(),
    externals: {
      streamedian: 'window.Streamedian'
    },
    resolve: {
      extensions: ['.js', '.vue', '.json', '.ts'],
      alias: alias
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: 'vue-loader'
        },
        {
          test: /\.ts$/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              appendTsSuffixTo: [/\.vue$/]
            }
          }
        },
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            query: { compact: false }
          }
        },
        {
          test: /\.(sass|scss)$/,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.css$/,
          oneOf: [
            // 有 ?url 的 css 导出为 url
            {
              resourceQuery: /(\?|&)styleUrl($|&)/,
              use: [
                {
                  loader: 'file-loader',
                  options: {
                    name: '[name].[hash].[ext]',
                    outputPath: assetsPath('styles'),
                    publicPath: '/styles'
                  }
                },
                'extract-loader',
                'css-loader'
              ]
            },
            {
              use: [
                'style-loader',
                'css-loader'
              ]
            }
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              fallback: 'file-loader',
              name: '[name].[hash].[ext]',
              outputPath: assetsPath('images'),
              publicPath: '/images'
            }
          }
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: assetsPath('fonts'),
              publicPath: '/fonts'
            }
          }
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new webpack.ProgressPlugin(),
    ],
    stats: {
      colors: true,
      children: false
    }
  };
};
