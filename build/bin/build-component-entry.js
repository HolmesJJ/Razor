const fs = require('fs');
const path = require('path');
const uppercamelcase = require('uppercamelcase');
const version = require('../../package.json').version;

const getComponents = require('./get-components');

// const namespace = '\'Rz\'';
const TIP = '// 本文件通过 /build/bin/build-component-entry.js 生成';
const excludeServiceComponents = [
  'notification',
  'message',
  'messageBox',
  'loading'
];

// build dev component entry --> /packages/index.js
function buildComponentEntry() {
  const Components = getComponents();
  const importList = Components.map(
    name => `import ${uppercamelcase(name)} from './${name}';`
  );
  const installList = Components.map(name => {
    return !excludeServiceComponents.includes(name) ? uppercamelcase(name) : '';
  });
  const exportList = Components.map(name => uppercamelcase(name));
  const outputDir = path.resolve(__dirname, '../../packages/index.js');

  const content = `${TIP}
${importList.join('\n')}
import CollapseTransition from 'rz/transitions/collapse-transition';
import _locale from 'rz/locale';

const components = [
  ${installList.filter(i => i).join(',\n  ')}
];

const directives = [Scroller.directive, Loading.directive];

const installDirectives = (Vue, directives) => {
  directives.forEach(directive => {
    if (
      directive.install &&
      toString.call(directive.install) === '[object Function]' &&
      directive.useInstall
    ) {
      Vue.use(directive);
    } else {
      Vue.directive(directive.name, directive);
    }
  });
};
const install = (Vue, Opts = {}) => {
  _locale.use(Opts.locale);
  _locale.i18n(Opts.i18n);
  /**
   * 全局注册组件
   * 使用的时候不需要再次component
   * 例子： <rz-map {...props} />
   */
  components.forEach(component => {
    Vue.use(component);
  });
  // register CollapseTransition
  Vue.component('Rz' + CollapseTransition.name, CollapseTransition);
  // if(Opts['map']){
  //   Vue.prototype.$mapConfig = Opts['map'];
  // }
  // 全局配置项
  Vue.prototype.$RAZOR = {
    size: Opts.size || '',
    zIndex: Opts.zIndex || 2000
  };

  Vue.prototype.$msgbox = MessageBox;
  Vue.prototype.$loading = Loading.service;
  Vue.prototype.$alert = MessageBox.alert;
  Vue.prototype.$confirm = MessageBox.confirm;
  Vue.prototype.$prompt = MessageBox.prompt;
  Vue.prototype.$notify = Notification;
  Vue.prototype.$message = Message;

  // 安装所有directive
  installDirectives(Vue, directives);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

const version = '${version}';

export default {
  version,
  install,
  locale: _locale.use,
  i18n: _locale.i18n,
};
const locale = _locale.use
const i18n = _locale.use
export {
  version,
  locale,
  i18n,
  install,
  ${exportList.join(',\n  ')}
};
`;

  // ${exportList.join(',\n  ')}
  fs.writeFileSync(outputDir, content);
}

// buildComponentEntry()

module.exports = buildComponentEntry;
