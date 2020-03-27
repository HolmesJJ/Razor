import { mount } from '@vue/test-utils';
import Cascader from '../src/index.vue';
// 编写 Cascader 的测试用例
describe('Cascader', () => {
  it('Cascader Mount', () => {
    const wrapper = mount(Cascader);
    expect(wrapper.exists()).toBe(true);
  });
});
