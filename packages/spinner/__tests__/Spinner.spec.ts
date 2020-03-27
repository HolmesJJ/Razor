import { mount } from '@vue/test-utils';
import Spinner from '../src/index.vue';
// 编写 Spinner 的测试用例
describe('Spinner', () => {
  it('Spinner Mount', () => {
    const wrapper = mount(Spinner);
    expect(wrapper.exists()).toBe(true);
  });
});
