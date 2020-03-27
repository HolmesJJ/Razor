import { mount } from '@vue/test-utils';


import TreeMap from '../src/index.vue';
// 编写 TreeMap 的测试用例
describe('TreeMap组件', () => {
  it('TreeMap Mount', () => {
    const wrapper = mount(TreeMap);
    expect(wrapper.exists()).toBe(true);
  });
});
    