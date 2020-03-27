import { mount } from '@vue/test-utils';

  
import DragUpload from '../src/index.vue';
// 编写 DragUpload 的测试用例
describe('DragUpload组件', () => {
  it('DragUpload Mount', () => {
    const wrapper = mount(DragUpload);
    expect(wrapper.exists()).toBe(true);
  });
});
    
