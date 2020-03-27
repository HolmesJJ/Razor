import { mount } from '@vue/test-utils';


import TimeSelect from '../../datePicker/src/picker/time-select';
// 编写 TimeSelect 的测试用例
describe('TimeSelect组件', () => {
  it('TimeSelect Mount', () => {
    const wrapper = mount(TimeSelect);
    expect(wrapper.exists()).toBe(true);
  });
});
