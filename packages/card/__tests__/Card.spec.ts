import { mount } from '@vue/test-utils';


import Card from '../src/index.vue';
// 编写 Card 的测试用例
describe('Card组件', () => {
  it('Card Mount', () => {
    const wrapper = mount(Card);
    expect(wrapper.exists()).toBe(true);
  });
});
    