const fs = require('fs');
const path = require('path');

// 取到packages里的所有组件
module.exports = function getComponents(_path = '../../packages', excludes = ['index.js', '_common', 'element.index.js', 'theme', '.DS_Store']) {
  const dirs = fs.readdirSync(path.resolve(__dirname, _path));
  return dirs.filter(dir => excludes.indexOf(dir) === -1);
};
