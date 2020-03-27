import { mount } from '@vue/test-utils';


import TagList from '../src/index.vue';
// 编写 TagList 的测试用例
describe('TagList组件', () => {
  it('TagList Mount', () => {
    const wrapper = mount(TagList);
    expect(wrapper.exists()).toBe(true);
  });
});
    