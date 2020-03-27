import { mount } from '@vue/test-utils';


import ColorfulBall from '../src/index.vue';
// 编写 ColorfulBall 的测试用例
describe('ColorfulBall组件', () => {
  it('ColorfulBall Mount', () => {
    const wrapper = mount(ColorfulBall);
    expect(wrapper.exists()).toBe(true);
  });
});
    