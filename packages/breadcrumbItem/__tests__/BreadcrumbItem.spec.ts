import { mount } from '@vue/test-utils';


import BreadcrumbItem from '../src/index.vue';
// 编写 BreadcrumbItem 的测试用例
describe('BreadcrumbItem组件', () => {
  it('BreadcrumbItem Mount', () => {
    const wrapper = mount(BreadcrumbItem);
    expect(wrapper.exists()).toBe(true);
  });
});
    