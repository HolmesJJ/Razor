import { mount } from '@vue/test-utils';
import Badge from '../src/index.vue';
// 编写 Badge 的测试用例
describe('Badge', () => {
  it('Badge Mount', () => {
    const wrapper = mount(Badge);
    expect(wrapper.exists()).toBe(true);
  });
});
