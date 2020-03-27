import navConfig from '../nav.config';
import uppercamelcase from 'uppercamelcase';

function createComponentRoute(groups, navPath) {
  let routes = [];
  groups.forEach(group => {
    const list = group.list;
    list.forEach(item => {
      const cmpNames = item.path.split('/').filter(i => i);
      if (!cmpNames.length) {
        console.warn(item, '没有正常的配置好路径');
        return;
      }
      const cmpPath =
        navPath !== 'doc' ? cmpNames.join('/') : 'docs/' + cmpNames.join('/');

      const cmpName = cmpNames[cmpNames.length - 1];
      routes.push({
        name: uppercamelcase(cmpName),
        path: item.path,
        // https://github.com/webpack/webpack/issues/6680
        component: () =>
          navPath !== 'doc'
            ? import('pkg/' + cmpPath + '/README.md')
            : import('doc/' + cmpPath + '/README.md') // 在动态import时，不能使用变量
      });
    });
  });
  return routes;
}

function createNav() {
  let componentRoutes = [];

  navConfig.forEach(nav => {
    createComponentRoute(nav.groups, nav.navPath).forEach(item =>
      componentRoutes.push(item)
    );
  });

  return componentRoutes;
}

export default createNav();
