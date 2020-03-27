const fs = require('fs');
const path = require('path');

const getComponents = require('./get-components');
const themeTypes = require('./theme-types');

const TIP = '// 本文件通过 /build/bin/build-style-entry.js 生成';

/* theme 的种类在这里配置 */

const excludeStyleDirs = ['common', 'fonts', 'mixins', 'img'];
// build dev style entry --> /packages/theme/{themeType}/index.scss
function buildStyleEntry(themeType) {
  // const Components = getComponents()
  const themePath = '../../packages/theme/' + themeType;
  const Components = getComponents(themePath, excludeStyleDirs);

  const componentsImportList = Components.map(name => {
    let importUrl = `@import './${name}';`;
    if (!name.match('scss') || name.match('index.scss')) return '';
    return importUrl;
  }).filter((url) => url);

  const outputDir = path.resolve(
    __dirname,
    `../../packages/theme/${themeType}/index.scss`
  );

  const content = `${TIP}
// components style
${componentsImportList.join('\n')}
`;
  // ${importList.join('\n')}
  fs.writeFileSync(outputDir, content);

}

const buildThemeEntry = () => {
  themeTypes.forEach((themeType) => {
    buildStyleEntry(themeType);
  });
};

// buildStyleEntry()
module.exports = buildThemeEntry;
