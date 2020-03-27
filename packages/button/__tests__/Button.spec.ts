import { mount } from '@vue/test-utils';
import Button from '../src/index.vue';

describe('Button组件', () => {
  it('加载后会渲染出一个button, 且该button具有类\'rz-button\'', () => {
    const wrapper = mount(Button);
    expect(wrapper.contains('button')).toBe(true);
    expect(wrapper.classes('rz-button')).toBe(true);
  });

  it('点击后会emit出一个\'click\'事件', () => {
    const wrapper = mount(Button);
    const button = wrapper.find('button.rz-button');
    button.trigger('click'); // click之后会emit一个click事件
    expect(wrapper.emitted().click).toBeTruthy();
  });

  it('当传入type=\'primary\'时，button样式会变为primary样式', () => {
    const wrapper = mount(Button, {
      propsData: {
        type: 'primary'
      }
    });
    expect(wrapper.classes('rz-button--primary')).toBe(true);
  });

  it('输入icon,icon 的span 必须要有', () => {
    const wrapper = mount(Button, {
      propsData: {
        icon: 'rz-icon-search'
      }
    });

    expect(wrapper.contains('i')).toBe(true);
    const icon = wrapper.findAll('rz-icon-search').at(0);
    expect(icon.classes('rz-icon-search')).toBe(true);
  });
});
