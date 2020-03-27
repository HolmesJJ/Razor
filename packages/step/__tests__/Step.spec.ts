import { mount } from '@vue/test-utils';
import Step from '../src/index.vue';
// 编写 Step 的测试用例
describe('Step', () => {
  it('Step Mount', () => {
    const wrapper = mount(Step);
    expect(wrapper.exists()).toBe(true);
  });
});
