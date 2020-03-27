import { mount } from '@vue/test-utils';
import Transfer from '../src/index.vue';
// 编写 Transfer 的测试用例
describe('Transfer', () => {
  it('Transfer Mount', () => {
    const wrapper = mount(Transfer);
    expect(wrapper.exists()).toBe(true);
  });
});
