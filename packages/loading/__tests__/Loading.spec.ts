import { mount } from '@vue/test-utils';

  
import Loading from '../src/index.vue';
// 编写 Loading 的测试用例
describe('Loading组件', () => {
  it('Loading Mount', () => {
    const wrapper = mount(Loading);
    expect(wrapper.exists()).toBe(true);
  });
});
    
