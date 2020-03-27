import { mount } from '@vue/test-utils';
import RadioGroup from '../src/index.vue';
// 编写 RadioGroup 的测试用例
describe('RadioGroup', () => {
  it('RadioGroup Mount', () => {
    const wrapper = mount(RadioGroup);
    expect(wrapper.exists()).toBe(true);
  });
});
