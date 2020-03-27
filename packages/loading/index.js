import directive from './src/directive';
import service from './src/index.js';

let Loading = {};

/* istanbul ignore next */
Loading.install = function(Vue) {
  Vue.prototype.$loading = service;
  Vue.use(directive);
};

Loading = {
  ...Loading,
  directive,
  service,
  options: {
    name: 'Loading'
  }
};

export default Loading;
