import { mount } from '@vue/test-utils';

  
import Icon from '../src/index.vue';
// 编写 Icon 的测试用例
describe('Icon组件', () => {
  it('Icon Mount', () => {
    const wrapper = mount(Icon);
    expect(wrapper.exists()).toBe(true);
  });
});
    
