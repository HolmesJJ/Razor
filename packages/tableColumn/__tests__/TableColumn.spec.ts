import { mount } from '@vue/test-utils';


import TableColumn from '../src/index';
// 编写 TableColumn 的测试用例
describe('TableColumn组件', () => {
  it('TableColumn Mount', () => {
    const wrapper = mount(TableColumn);
    expect(wrapper.exists()).toBe(true);
  });
});
