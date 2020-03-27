import { mount } from '@vue/test-utils';
import Notification from '../src/index.vue';
// 编写 Notification 的测试用例
describe('Notification', () => {
  it('Notification Mount', () => {
    const wrapper = mount(Notification);
    expect(wrapper.exists()).toBe(true);
  });
});
