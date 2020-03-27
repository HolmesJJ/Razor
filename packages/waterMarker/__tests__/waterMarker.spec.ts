import { mount } from '@vue/test-utils';

  
import waterMarker from '../src/index.vue';
// 编写 waterMarker 的测试用例
describe('waterMarker组件', () => {
  it('waterMarker Mount', () => {
    const wrapper = mount(waterMarker);
    expect(wrapper.exists()).toBe(true);
  });
});
    
