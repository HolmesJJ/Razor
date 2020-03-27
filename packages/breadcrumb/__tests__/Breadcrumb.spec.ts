import { mount } from '@vue/test-utils';


import Breadcrumb from '../src/index.vue';
// 编写 Breadcrumb 的测试用例
describe('Breadcrumb组件', () => {
  it('Breadcrumb Mount', () => {
    const wrapper = mount(Breadcrumb);
    expect(wrapper.exists()).toBe(true);
  });
});
    