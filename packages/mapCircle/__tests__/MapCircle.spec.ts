import { mount } from '@vue/test-utils';


import MapCircle from '../src/index.vue';
// 编写 MapCircle 的测试用例
describe('MapCircle组件', () => {
  it('MapCircle Mount', () => {
    const wrapper = mount(MapCircle);
    expect(wrapper.exists()).toBe(true);
  });
});
    
