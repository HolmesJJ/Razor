import { mount } from '@vue/test-utils';
import Tag from '../src/index.vue';
// 编写 Tag 的测试用例
describe('Tag', () => {
  it('Tag Mount', () => {
    const wrapper = mount(Tag);
    expect(wrapper.exists()).toBe(true);
  });
});
