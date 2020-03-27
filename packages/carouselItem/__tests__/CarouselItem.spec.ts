import { mount } from '@vue/test-utils';
import CarouselItem from '../src/index.vue';
// 编写 CarouselItem 的测试用例
describe('CarouselItem', () => {
  it('CarouselItem Mount', () => {
    const wrapper = mount(CarouselItem);
    expect(wrapper.exists()).toBe(true);
  });
});
