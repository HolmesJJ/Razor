import { mount } from '@vue/test-utils';
import Autocomplete from '../src/index.vue';
// 编写 Autocomplete 的测试用例
describe('Autocomplete组件', () => {
  it('Autocomplete Mount', () => {
    const wrapper = mount(Autocomplete);
    expect(wrapper.exists()).toBe(true);
  });
});
