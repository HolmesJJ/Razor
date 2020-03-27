import { mount } from '@vue/test-utils';


import PolygonDrawer from '../src/index.vue';
// 编写 PolygonDrawer 的测试用例
describe('PolygonDrawer组件', () => {
  it('PolygonDrawer Mount', () => {
    const wrapper = mount(PolygonDrawer);
    expect(wrapper.exists()).toBe(true);
  });
});
    
