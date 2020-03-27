import { mount } from '@vue/test-utils';


import TimelineItem from '../src/index.vue';
// 编写 TimelineItem 的测试用例
describe('TimelineItem组件', () => {
  it('TimelineItem Mount', () => {
    const wrapper = mount(TimelineItem);
    expect(wrapper.exists()).toBe(true);
  });
});
    