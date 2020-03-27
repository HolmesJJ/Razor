import { mount } from '@vue/test-utils';

  
import OptionGroup from '../src/index.vue';
// 编写 OptionGroup 的测试用例
describe('OptionGroup组件', () => {
  it('OptionGroup Mount', () => {
    const wrapper = mount(OptionGroup);
    expect(wrapper.exists()).toBe(true);
  });
});
    
