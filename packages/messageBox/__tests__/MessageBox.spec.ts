import { mount } from '@vue/test-utils';
import MessageBox from '../src/main';
// 编写 Message 的测试用例
describe('MessageBox', () => {
  it('Message Mount', () => {
    const wrapper = mount(MessageBox);
    expect(wrapper.exists()).toBe(true);
  });
});
