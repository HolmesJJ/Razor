const nodeExternals = require('webpack-node-externals');
const Components = require('./components.json');

let externals = {};

Object.keys(Components).forEach(function(key) {
  externals[`pkg/${key}`] = `@sensetime/razor/components/${key}`;
});

exports.externals = Object.assign({
  vue: {
    root: 'Vue',
    commonjs: 'vue',
    commonjs2: 'vue',
    amd: 'vue'
  }
}, {...externals}, {...nodeExternals()})