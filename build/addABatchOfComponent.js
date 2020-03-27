const createFile = require('./cli/create-file');
const createFolder = require('./cli/create-folder');
const fs = require('fs');
const buildComponentEntry = require('./bin/build-component-entry');
const buildStyleEntry = require('./bin/build-style-entry');
const path = require('path');

var elements = [
  // "transfer"
  'col',
  'autocomplete'
];

function fsExistsSync(path) {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    console.log('-------------');
    return false;
  }

  return true;
}

elements.forEach((option) => {
  console.log(option);
  if (!fsExistsSync(
    path.resolve(__dirname, `./packages/${option}`)
  )) {
    createFolder(option).then(cmpName => {
      createFile(cmpName).then(success => {
        console.log(success);
        buildComponentEntry();
        buildStyleEntry();
      });
    });
  } else {
    console.log('组件已存在');
  }

});
