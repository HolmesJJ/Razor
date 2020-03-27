import { mount } from '@vue/test-utils';


import FramePlayer from '../src/index.vue';
// 编写 FramePlayer 的测试用例
describe('FramePlayer组件', () => {
  it('FramePlayer Mount', () => {
    const wrapper = mount(FramePlayer);
    expect(wrapper.exists()).toBe(true);
  });
});
    