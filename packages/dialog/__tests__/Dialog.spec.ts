import { mount } from '@vue/test-utils';

  
import Dialog from '../src/index.vue';
// 编写 Dialog 的测试用例
describe('Dialog组件', () => {
  it('Dialog Mount', () => {
    const wrapper = mount(Dialog);
    expect(wrapper.exists()).toBe(true);
  });
});
    
