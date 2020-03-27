import { mount } from '@vue/test-utils';
import Form from '../src/index.vue';
// 编写 Form 的测试用例
describe('Form', () => {
  it('Form Mount', () => {
    const wrapper = mount(Form);
    expect(wrapper.exists()).toBe(true);
  });
});
