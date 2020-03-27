import { mount } from '@vue/test-utils';


import MassTreeMap from '../src/index.vue';
// 编写 MassTreeMap 的测试用例
describe('MassTreeMap组件', () => {
  it('MassTreeMap Mount', () => {
    const wrapper = mount(MassTreeMap);
    expect(wrapper.exists()).toBe(true);
  });
});
    