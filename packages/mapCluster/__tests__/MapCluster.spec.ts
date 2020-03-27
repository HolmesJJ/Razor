import { mount } from '@vue/test-utils';


import MapCluster from '../src/index.vue';
// 编写 MapCluster 的测试用例
describe('MapCluster组件', () => {
  it('MapCluster Mount', () => {
    const wrapper = mount(MapCluster);
    expect(wrapper.exists()).toBe(true);
  });
});
    
