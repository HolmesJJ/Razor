import { mount } from '@vue/test-utils';
import Carousel from '../src/index.vue';
// 编写 Carousel 的测试用例
describe('Carousel', () => {
  it('Carousel Mount', () => {
    const wrapper = mount(Carousel);
    expect(wrapper.exists()).toBe(true);
  });
});
