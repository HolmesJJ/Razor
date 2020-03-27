import { mount } from '@vue/test-utils';
import OnOff from '../src/index.vue';
// 编写 OnOff 的测试用例
describe('OnOff', () => {
  it('OnOff Mount', () => {
    const wrapper = mount(OnOff);
    expect(wrapper.exists()).toBe(true);
  });
});
