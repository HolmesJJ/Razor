import { mount } from '@vue/test-utils';
import ColorPicker from '../src/index.vue';
// 编写 ColorPicker 的测试用例
describe('ColorPicker', () => {
  it('ColorPicker Mount', () => {
    const wrapper = mount(ColorPicker);
    expect(wrapper.exists()).toBe(true);
  });
});
