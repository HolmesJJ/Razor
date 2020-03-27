import { mount } from '@vue/test-utils';


import MapMarker from '../src/index.vue';
// 编写 MapMarker 的测试用例
describe('MapMarker组件', () => {
  it('MapMarker Mount', () => {
    const wrapper = mount(MapMarker);
    expect(wrapper.exists()).toBe(true);
  });
});
    
