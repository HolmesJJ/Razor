import { mount } from '@vue/test-utils';
import FormItem from '../src/index.vue';
// 编写 FormItem 的测试用例
describe('FormItem', () => {
  it('FormItem Mount', () => {
    const wrapper = mount(FormItem);
    expect(wrapper.exists()).toBe(true);
  });
});
