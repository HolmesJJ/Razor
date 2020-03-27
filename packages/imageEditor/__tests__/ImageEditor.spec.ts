import { mount } from '@vue/test-utils';


import ImageEditor from '../src/index.vue';
// 编写 ImageEditor 的测试用例
describe('ImageEditor组件', () => {
  it('ImageEditor Mount', () => {
    const wrapper = mount(ImageEditor);
    expect(wrapper.exists()).toBe(true);
  });
});
    
