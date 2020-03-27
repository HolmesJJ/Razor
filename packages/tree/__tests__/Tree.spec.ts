import { mount } from '@vue/test-utils';
import Tree from '../src/index.vue';
// 编写 Tree 的测试用例
describe('Tree', () => {
  it('Tree Mount', () => {
    const wrapper = mount(Tree);
    expect(wrapper.exists()).toBe(true);
  });
});
