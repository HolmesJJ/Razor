import { mount } from '@vue/test-utils';

  
import Upload from '../src/index.vue';
// 编写 Upload 的测试用例
describe('Upload组件', () => {
  it('Upload Mount', () => {
    const wrapper = mount(Upload);
    expect(wrapper.exists()).toBe(true);
  });
});
    
