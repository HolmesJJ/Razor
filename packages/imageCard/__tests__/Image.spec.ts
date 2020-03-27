import { mount } from '@vue/test-utils';


import Image from '../src/index.vue';
// 编写 Image 的测试用例
describe('Image组件', () => {
  it('Image Mount', () => {
    const wrapper = mount(Image);
    expect(wrapper.exists()).toBe(true);
  });
});
    
