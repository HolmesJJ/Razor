import { mount } from '@vue/test-utils';
import Tooltip from '../src/main';
// 编写 Tooltip 的测试用例
describe('Tooltip', () => {
  it('Tooltip Mount', () => {
    const wrapper = mount(Tooltip);
    expect(wrapper.exists()).toBe(true);
  });
});
