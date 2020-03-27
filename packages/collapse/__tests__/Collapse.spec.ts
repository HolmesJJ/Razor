import { mount } from '@vue/test-utils';
import Collapse from '../src/index.vue';
// 编写 Collapse 的测试用例
describe('Collapse', () => {
  it('Collapse Mount', () => {
    const wrapper = mount(Collapse);
    expect(wrapper.exists()).toBe(true);
  });
});
