import Pagination from './src/pagination';

/* istanbul ignore next */
Pagination.install = function(Vue) {
  Vue.component('Rz' + Pagination.options.name, Pagination);
};

export default Pagination;
