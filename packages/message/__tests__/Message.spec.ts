import { mount } from '@vue/test-utils';
import Message from '../src/index.vue';
// 编写 Message 的测试用例
describe('Message', () => {
  it('Message Mount', () => {
    const wrapper = mount(Message);
    expect(wrapper.exists()).toBe(true);
  });
});
