import { mount } from '@vue/test-utils';
import Dropdown from '../src/index.vue';
// 编写 Dropdown 的测试用例
describe('Dropdown', () => {
  it('Dropdown Mount', () => {
    const wrapper = mount(Dropdown);
    expect(wrapper.exists()).toBe(true);
  });
});
