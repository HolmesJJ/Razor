import { mount } from '@vue/test-utils';


import Backtop from '../src/index.vue';
// 编写 Backtop 的测试用例
describe('Backtop组件', () => {
  it('Backtop Mount', () => {
    const wrapper = mount(Backtop);
    expect(wrapper.exists()).toBe(true);
  });
});
    