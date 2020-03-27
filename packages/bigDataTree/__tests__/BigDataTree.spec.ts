import { mount } from '@vue/test-utils';


import BigDataTree from '../src/index.vue';
// 编写 BigDataTree 的测试用例
describe('BigDataTree组件', () => {
  it('BigDataTree Mount', () => {
    const wrapper = mount(BigDataTree);
    expect(wrapper.exists()).toBe(true);
  });
});
    