import { mount } from '@vue/test-utils';
import Radio from '../src/index.vue';
// 编写 Radio 的测试用例
describe('Radio', () => {
  it('Radio Mount', () => {
    const wrapper = mount(Radio);
    expect(wrapper.exists()).toBe(true);
  });
});
