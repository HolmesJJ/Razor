import { mount } from '@vue/test-utils';
import Scrollbar from '../src/main';
// 编写 Scrollbar 的测试用例
describe('Scrollbar', () => {
  it('Scrollbar Mount', () => {
    const wrapper = mount(Scrollbar);
    expect(wrapper.exists()).toBe(true);
  });
});
