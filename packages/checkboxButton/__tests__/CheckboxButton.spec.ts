import { mount } from '@vue/test-utils';
import CheckboxButton from '../src/index.vue';
// 编写 CheckboxButton 的测试用例
describe('CheckboxButton', () => {
  it('CheckboxButton Mount', () => {
    const wrapper = mount(CheckboxButton);
    expect(wrapper.exists()).toBe(true);
  });
});
