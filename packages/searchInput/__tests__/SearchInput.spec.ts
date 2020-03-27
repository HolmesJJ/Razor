import { mount } from '@vue/test-utils';

  
import SearchInput from '../src/index.vue';
// 编写 SearchInput 的测试用例
describe('SearchInput组件', () => {
  it('SearchInput Mount', () => {
    const wrapper = mount(SearchInput);
    expect(wrapper.exists()).toBe(true);
  });
});
    
