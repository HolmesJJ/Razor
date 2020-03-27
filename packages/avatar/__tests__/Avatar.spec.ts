import { mount } from '@vue/test-utils';


import Avatar from '../src/index.vue';
// 编写 Avatar 的测试用例
describe('Avatar组件', () => {
  it('Avatar Mount', () => {
    const wrapper = mount(Avatar);
    expect(wrapper.exists()).toBe(true);
  });
});
    