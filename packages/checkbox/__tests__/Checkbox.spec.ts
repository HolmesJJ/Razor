import { mount } from '@vue/test-utils';
import Checkbox from '../src/index.vue';
// 编写 Checkbox 的测试用例
describe('Checkbox', () => {
  it('Checkbox Mount', () => {
    const wrapper = mount(Checkbox);
    expect(wrapper.exists()).toBe(true);
  });
});
