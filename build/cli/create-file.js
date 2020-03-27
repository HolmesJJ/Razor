const fs = require('fs');
const path = require('path');
const uppercamelcase = require('uppercamelcase');
const themeTypes = require('../bin/theme-types');
/**
 * 初始化创建组件样式文件
 * @param {String} folderName 组件名
 */
function createStyleFile(folderName, ThemeType = '') {
  if (!folderName) {
    throw new Error('folderName is necessary');
  }
  const styleOutputDir = path.resolve(
    __dirname,
    `../../packages/theme/${ThemeType}/${folderName}.scss`
  );
  fs.writeFileSync(
    styleOutputDir,
    `@import "mixins/mixins";
@import "common/var";\n
`
  );
}

function createStyleFiles(folderName) {
  themeTypes.forEach(themeType => {
    createStyleFile(folderName, themeType);
  });
}

function createReadmeFile(folderName) {
  const readmeOutputDir = path.resolve(
    __dirname,
    `../../packages/${folderName}/README.md`
  );
  fs.writeFileSync(readmeOutputDir, `### ${uppercamelcase(folderName)}`);
}

/**
 * 初始化创建组件测试文件
 * @param {String} folderName 组件名
 */
function createTestFile(folderName) {
  const testOutputDir = path.resolve(
    __dirname,
    `../../packages/${folderName}/__tests__/${uppercamelcase(
      folderName
    )}.spec.ts`
  );

  const testOutputContent = `import { mount } from '@vue/test-utils';


import ${uppercamelcase(folderName)} from '../src/index.vue';
// 编写 ${uppercamelcase(folderName)} 的测试用例
describe('${uppercamelcase(folderName)}组件', () => {
  it('${uppercamelcase(folderName)} Mount', () => {
    const wrapper = mount(${uppercamelcase(folderName)});
    expect(wrapper.exists()).toBe(true);
  });
});
    `;
  fs.writeFileSync(testOutputDir, testOutputContent);
}

/**
 * 初始化创建组件文件
 * @param {String} folderName 组件名
 */
function createComponentFile(folderName) {
  const componentName = uppercamelcase(folderName);
  const outputDir = path.resolve(
    __dirname,
    `../../packages/${folderName}/src/index.vue`
  );

  const content = `<template>
    <!-- 编写 ${folderName} 组件 -->
    <div></div>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'

@Component({
  name: '${componentName}'
})
export default class ${componentName} extends Vue {}
</script>
`;
  fs.writeFileSync(outputDir, content);
}

/**
 * 初始化创建组件入口文件
 * @param {String} folderName 组件名
 */
function createComponentEntryFile(folderName) {
  const outputDir = path.resolve(
    __dirname,
    `../../packages/${folderName}/index.js`
  );

  const content = `
// 编写 ${folderName} 组件
import ${folderName} from './src/index.vue';

/* istanbul ignore next */
${folderName}.install = function(Vue) {
  // ts 装饰器会把 name 放在options
  Vue.component('Rz' + ${folderName}.options.name, ${folderName});
};

export default ${folderName};
`;
  fs.writeFileSync(outputDir, content);
}

function createFile(folderName) {
  const successInfo = `组件创建成功, 所在目录: packages/${folderName}`;
  const p = new Promise((resolve, reject) => {
    createStyleFiles(folderName);
    createReadmeFile(folderName);
    createTestFile(folderName);
    createComponentFile(folderName);
    createComponentEntryFile(folderName);
    resolve(successInfo);
  });
  return p;
}

module.exports = createFile;
