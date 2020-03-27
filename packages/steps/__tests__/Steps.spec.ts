import { mount } from '@vue/test-utils';
import Steps from '../src/index.vue';
// 编写 Steps 的测试用例
describe('Steps', () => {
  it('Steps Mount', () => {
    const wrapper = mount(Steps);
    expect(wrapper.exists()).toBe(true);
  });
});
