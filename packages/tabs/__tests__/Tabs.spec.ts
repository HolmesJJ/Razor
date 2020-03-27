import { mount } from '@vue/test-utils';
import Tabs from '../src/index.vue';
// 编写 Tabs 的测试用例
describe('Tabs', () => {
  it('Tabs Mount', () => {
    const wrapper = mount(Tabs);
    expect(wrapper.exists()).toBe(true);
  });
});
