import { mount } from '@vue/test-utils';
import Col from '../src/main';
// 编写 Col 的测试用例
describe('Col', () => {
  it('Col Mount', () => {
    const wrapper = mount(Col);
    expect(wrapper.exists()).toBe(true);
  });
});
