import { mount } from '@vue/test-utils';

import RtspPlayer from '../src/index.vue';
// 编写 RtspPlayer 的测试用例
describe('RtspPlayer组件', () => {
  it('RtspPlayer Mount', () => {
    const wrapper = mount(RtspPlayer);
    expect(wrapper.exists()).toBe(true);
  });
});
    