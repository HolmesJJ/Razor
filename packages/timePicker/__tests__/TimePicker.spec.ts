import { mount } from '@vue/test-utils';
import TimePicker from '../../datePicker/src/picker/time-picker';
// 编写 TimePicker 的测试用例
describe('TimePicker', () => {
  it('TimePicker Mount', () => {
    const wrapper = mount(TimePicker);
    expect(wrapper.exists()).toBe(true);
  });
});
