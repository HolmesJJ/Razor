import { mount } from '@vue/test-utils';


import Counter from '../src/index.vue';
// 编写 Counter 的测试用例
describe('Counter组件', () => {
  it('Counter Mount', () => {
    const wrapper = mount(Counter);
    expect(wrapper.exists()).toBe(true);
  });
});
    