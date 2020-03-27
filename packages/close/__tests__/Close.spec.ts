import { mount } from '@vue/test-utils';


import Close from '../src/index.vue';
// 编写 Close 的测试用例
describe('Close组件', () => {
  it('Close Mount', () => {
    const wrapper = mount(Close);
    expect(wrapper.exists()).toBe(true);
  });
});
    