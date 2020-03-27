import { mount } from '@vue/test-utils';
import Row from '../src/main';
// 编写 Row 的测试用例
describe('Row', () => {
  it('Row Mount', () => {
    const wrapper = mount(Row);
    expect(wrapper.exists()).toBe(true);
  });
});
