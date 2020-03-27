import { mount } from '@vue/test-utils';
import Alert from '../src/index.vue';
// 编写 Alert 的测试用例
describe('Alert', () => {
  it('Alert Mount', () => {
    const wrapper = mount(Alert);
    expect(wrapper.exists()).toBe(true);
  });
});
