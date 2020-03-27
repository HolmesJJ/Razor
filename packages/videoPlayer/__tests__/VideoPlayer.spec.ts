import { mount } from '@vue/test-utils';
import VideoPlayer from '../src/index.vue';
// 编写 VideoPlayer 的测试用例
describe('VideoPlayer', () => {
  it('VideoPlayer Mount', () => {
    const wrapper = mount(VideoPlayer);
    expect(wrapper.exists()).toBe(true);
  });
});
