import Vue from 'vue';
import Router from 'vue-router';

import componentRoutes from './component-route';

Vue.use(Router);

const routes = [
  {
    path: '/',
    redirect: '/developer'
  },
  {
    path: '/index',
    redirect: '/developer'
  }
].concat(componentRoutes);

export default new Router({
  routes
});
