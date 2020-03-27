import { mount } from '@vue/test-utils';


import Annulus from '../src/index.vue';
// 编写 Annulus 的测试用例
describe('Annulus组件', () => {
  it('Annulus Mount', () => {
    const wrapper = mount(Annulus);
    expect(wrapper.exists()).toBe(true);
  });
});
    