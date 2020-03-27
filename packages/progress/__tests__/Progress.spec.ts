import { mount } from '@vue/test-utils';
import Progress from '../src/index.vue';
// 编写 Progress 的测试用例
describe('Progress', () => {
  it('Progress Mount', () => {
    const wrapper = mount(Progress);
    expect(wrapper.exists()).toBe(true);
  });
});
