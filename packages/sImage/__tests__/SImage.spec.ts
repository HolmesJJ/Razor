import { mount } from '@vue/test-utils';


import SImage from '../src/index.vue';
// 编写 SImage 的测试用例
describe('SImage组件', () => {
  it('SImage Mount', () => {
    const wrapper = mount(SImage);
    expect(wrapper.exists()).toBe(true);
  });
});
    