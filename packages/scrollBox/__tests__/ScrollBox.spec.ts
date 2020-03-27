import { mount } from '@vue/test-utils';


import ScrollBox from '../src/index.vue';
// 编写 ScrollBox 的测试用例
describe('ScrollBox组件', () => {
  it('ScrollBox Mount', () => {
    const wrapper = mount(ScrollBox);
    expect(wrapper.exists()).toBe(true);
  });
});
    