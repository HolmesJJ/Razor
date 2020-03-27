import { mount } from '@vue/test-utils';

  
import Option from '../src/index.vue';
// 编写 Option 的测试用例
describe('Option组件', () => {
  it('Option Mount', () => {
    const wrapper = mount(Option);
    expect(wrapper.exists()).toBe(true);
  });
});
    
