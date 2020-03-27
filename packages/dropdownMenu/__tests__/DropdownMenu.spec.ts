import { mount } from '@vue/test-utils';

  
import DropdownMenu from '../src/index.vue';
// 编写 DropdownMenu 的测试用例
describe('DropdownMenu组件', () => {
  it('DropdownMenu Mount', () => {
    const wrapper = mount(DropdownMenu);
    expect(wrapper.exists()).toBe(true);
  });
});
    
