import { mount } from '@vue/test-utils';


import MapPolyline from '../src/index.vue';
// 编写 MapPolyline 的测试用例
describe('MapPolyline组件', () => {
  it('MapPolyline Mount', () => {
    const wrapper = mount(MapPolyline);
    expect(wrapper.exists()).toBe(true);
  });
});
    
