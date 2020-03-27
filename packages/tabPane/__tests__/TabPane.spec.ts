import { mount } from '@vue/test-utils';
import TabPane from '../../tabs/src/tab-pane.vue';
// 编写 TabPane 的测试用例
describe('TabPane', () => {
  it('TabPane Mount', () => {
    const wrapper = mount(TabPane);
    expect(wrapper.exists()).toBe(true);
  });
});
