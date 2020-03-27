/* 编译这个md 经常出现代码格式不对, 运行node replace.js 可以解决这个问题 */
/* eslint-disable-next-line */
const fs = require('fs');
const myPath = './README.md';
const fsContent = fs.readFileSync(myPath).toString();
const reg = /: (\d+)/g
const replaceContent = fsContent.replace(reg, ($1) => {
  return $1.replace(' ', '')
})
fs.unlinkSync(myPath);
fs.writeFileSync(myPath, replaceContent)

