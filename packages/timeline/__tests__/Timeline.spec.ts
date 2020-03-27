import { mount } from '@vue/test-utils';


import Timeline from '../src/index.vue';
// 编写 Timeline 的测试用例
describe('Timeline组件', () => {
  it('Timeline Mount', () => {
    const wrapper = mount(Timeline);
    expect(wrapper.exists()).toBe(true);
  });
});
    