import { mount } from '@vue/test-utils';


import ImageClose from '../src/index.vue';
// 编写 ImageClose 的测试用例
describe('ImageClose组件', () => {
  it('ImageClose Mount', () => {
    const wrapper = mount(ImageClose);
    expect(wrapper.exists()).toBe(true);
  });
});
    