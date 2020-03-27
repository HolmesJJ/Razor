import { mount } from '@vue/test-utils';

  
import DropdownItem from '../src/index.vue';
// 编写 DropdownItem 的测试用例
describe('DropdownItem组件', () => {
  it('DropdownItem Mount', () => {
    const wrapper = mount(DropdownItem);
    expect(wrapper.exists()).toBe(true);
  });
});
    
