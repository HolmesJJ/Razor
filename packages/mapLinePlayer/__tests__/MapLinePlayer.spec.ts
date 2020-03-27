import { mount } from '@vue/test-utils';


import MapLinePlayer from '../src/index.vue';
// 编写 MapLinePlayer 的测试用例
describe('MapLinePlayer组件', () => {
  it('MapLinePlayer Mount', () => {
    const wrapper = mount(MapLinePlayer);
    expect(wrapper.exists()).toBe(true);
  });
});
    