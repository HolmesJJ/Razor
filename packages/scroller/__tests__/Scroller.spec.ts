import { mount } from '@vue/test-utils';
import Scroller from '../src/index.vue';
// 编写 Scroller 的测试用例
describe('Scroller', () => {
  it('Scroller Mount', () => {
    const wrapper = mount(Scroller);
    expect(wrapper.exists()).toBe(true);
  });
});
