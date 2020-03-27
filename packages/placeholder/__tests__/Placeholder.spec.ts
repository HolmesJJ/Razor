import { mount } from '@vue/test-utils';


import Placeholder from '../src/index.vue';
// 编写 Placeholder 的测试用例
describe('Placeholder组件', () => {
  it('Placeholder Mount', () => {
    const wrapper = mount(Placeholder);
    expect(wrapper.exists()).toBe(true);
  });
});
    