import { mount } from '@vue/test-utils';
import CollapseItem from '../src/index.vue';
// 编写 CollapseItem 的测试用例
describe('CollapseItem', () => {
  it('CollapseItem Mount', () => {
    const wrapper = mount(CollapseItem);
    expect(wrapper.exists()).toBe(true);
  });
});
