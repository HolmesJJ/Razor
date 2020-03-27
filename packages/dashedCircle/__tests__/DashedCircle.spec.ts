import { mount } from '@vue/test-utils';


import DashedCircle from '../src/index.vue';
// 编写 DashedCircle 的测试用例
describe('DashedCircle组件', () => {
  it('DashedCircle Mount', () => {
    const wrapper = mount(DashedCircle);
    expect(wrapper.exists()).toBe(true);
  });
});
    