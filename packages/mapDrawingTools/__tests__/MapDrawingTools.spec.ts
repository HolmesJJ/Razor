import { mount } from '@vue/test-utils';


import MapDrawingTools from '../src/index.vue';
// 编写 MapDrawingTools 的测试用例
describe('MapDrawingTools组件', () => {
  it('MapDrawingTools Mount', () => {
    const wrapper = mount(MapDrawingTools);
    expect(wrapper.exists()).toBe(true);
  });
});
    
