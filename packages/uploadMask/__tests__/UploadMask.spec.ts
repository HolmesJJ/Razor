import { mount } from '@vue/test-utils';

  
import UploadMask from '../src/index.vue';
// 编写 UploadMask 的测试用例
describe('UploadMask组件', () => {
  it('UploadMask Mount', () => {
    const wrapper = mount(UploadMask);
    expect(wrapper.exists()).toBe(true);
  });
});
    
