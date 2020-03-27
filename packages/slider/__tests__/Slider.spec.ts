import { mount } from '@vue/test-utils';
import Slider from '../src/index.vue';
// 编写 Slider 的测试用例
describe('Slider', () => {
  it('Slider Mount', () => {
    const wrapper = mount(Slider);
    expect(wrapper.exists()).toBe(true);
  });
});
