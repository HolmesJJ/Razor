import { mount } from '@vue/test-utils';


import MapHeatmap from '../src/index.vue';
// 编写 MapHeatmap 的测试用例
describe('MapHeatmap组件', () => {
  it('MapHeatmap Mount', () => {
    const wrapper = mount(MapHeatmap);
    expect(wrapper.exists()).toBe(true);
  });
});
    