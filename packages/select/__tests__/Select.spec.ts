import { mount } from '@vue/test-utils';
import Select from '../src/index.vue';
// 编写 Select 的测试用例
describe('Select', () => {
  it('Select Mount', () => {
    const wrapper = mount(Select);
    expect(wrapper.exists()).toBe(true);
  });
});
