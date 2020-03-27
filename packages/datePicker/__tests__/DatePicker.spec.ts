import { mount } from '@vue/test-utils';

  
import DatePicker from '../src/index.vue';
// 编写 DatePicker 的测试用例
describe('DatePicker组件', () => {
  it('DatePicker Mount', () => {
    const wrapper = mount(DatePicker);
    expect(wrapper.exists()).toBe(true);
  });
});
    
