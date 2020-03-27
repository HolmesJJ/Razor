import { mount } from '@vue/test-utils';
import Input from '../src/index.vue';
// 编写 Input 的测试用例
describe('Input', () => {
  it('Input Mount', () => {
    const wrapper = mount(Input);
    expect(wrapper.exists()).toBe(true);
  });
});
