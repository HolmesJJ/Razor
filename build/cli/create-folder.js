const fs = require('fs');
const path = require('path');

/**
 * 根据传入的组件名，建立对应的组件文件夹
 * @param {String} folderName 组件文件夹
 * @returns Promise.resolve(folderName)
 */
function createFolder(folderName) {
  if (typeof folderName !== 'string') {
    throw new Error('folder name must be a string');
  }
  const p = new Promise((resolve, reject) => {
    const outputDir = path.resolve(
      __dirname,
      `../../packages/${folderName}`
    );
    fs.mkdir(outputDir, err => {
      if (err) {
        reject(err);
      }

      fs.mkdir(
        path.resolve(
          __dirname,
          `../../packages/${folderName}/__tests__`
        ),
        err => {
          fs.mkdir(
            path.resolve(
              __dirname,
              `../../packages/${folderName}/src`
            ),
            err => {
              if (err) {
                reject(err);
              }
              resolve(folderName);
            }
          );
        }
      );
    });
  });
  return p;
}

module.exports = createFolder;
