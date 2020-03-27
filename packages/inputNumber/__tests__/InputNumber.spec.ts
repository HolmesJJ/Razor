import { mount } from '@vue/test-utils';
import InputNumber from '../src/index.vue';
// 编写 InputNumber 的测试用例
describe('InputNumber', () => {
  it('InputNumber Mount', () => {
    const wrapper = mount(InputNumber);
    expect(wrapper.exists()).toBe(true);
  });
});
