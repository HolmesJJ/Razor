import { mount } from '@vue/test-utils';


import MapTool from '../src/index.vue';
// 编写 MapTool 的测试用例
describe('MapTool组件', () => {
  it('MapTool Mount', () => {
    const wrapper = mount(MapTool);
    expect(wrapper.exists()).toBe(true);
  });
});
    