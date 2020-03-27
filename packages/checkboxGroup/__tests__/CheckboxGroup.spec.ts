import { mount } from '@vue/test-utils';
import CheckboxGroup from '../src/index.vue';
describe('CheckboxGroup', () => {
  it('CheckboxGroup Mount', () => {
    const wrapper = mount(CheckboxGroup);
    expect(wrapper.exists()).toBe(true);
  });
});
