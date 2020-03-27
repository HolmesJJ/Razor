const fs = require('fs');
const path = require('path');
const uppercamelcase = require('uppercamelcase');
const getComponents = require('./get-components');

const buildComponentJson = () => {
  const components = getComponents();
  const json = {};
  const prifix = './packages/';
  const suffix = '/index.js';
  components.forEach(item => json[item] = `${prifix}${item}${suffix}`);
  const content = `{
  ${components.map(item => `"${item}":"${json[item]}"`).join(',\n  ')}
}`;
  const outputDir = path.resolve(__dirname, '../components.json');
  fs.writeFileSync(outputDir, content);
};
buildComponentJson();

module.exports = buildComponentJson;
