import { mount } from '@vue/test-utils';


import MapPolygon from '../src/index.vue';
// 编写 MapPolygon 的测试用例
describe('MapPolygon组件', () => {
  it('MapPolygon Mount', () => {
    const wrapper = mount(MapPolygon);
    expect(wrapper.exists()).toBe(true);
  });
});
    
