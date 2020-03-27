import { mount } from '@vue/test-utils';
import RadioButton from '../src/index.vue';
// 编写 RadioButton 的测试用例
describe('RadioButton', () => {
  it('RadioButton Mount', () => {
    const wrapper = mount(RadioButton);
    expect(wrapper.exists()).toBe(true);
  });
});
