import { mount } from '@vue/test-utils';

  
import SelectDropdown from '../src/index.vue';
// 编写 SelectDropdown 的测试用例
describe('SelectDropdown组件', () => {
  it('SelectDropdown Mount', () => {
    const wrapper = mount(SelectDropdown);
    expect(wrapper.exists()).toBe(true);
  });
});
    
