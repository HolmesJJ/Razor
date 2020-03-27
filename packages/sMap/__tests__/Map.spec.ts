import { mount } from '@vue/test-utils';


import Map from '../src/index.vue';
// 编写 Map 的测试用例
describe('Map组件', () => {
  it('Map Mount', () => {
    const wrapper = mount(Map);
    expect(wrapper.exists()).toBe(true);
  });
});
    
