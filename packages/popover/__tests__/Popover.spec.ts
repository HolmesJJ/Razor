import { mount, shallowMount } from '@vue/test-utils';
import Popover from '../src/index.vue';
// 编写 Popover 的测试用例

describe('Popover组件', () => {
    it('添加触发弹窗的click事件', () => {
        const wrapper = shallowMount(Popover, {
            propsData: {
                trigger: 'click'
            },
            slots: {
                reference: '<div class="st-test" />'
            }
        });
        wrapper.find('.st-test').trigger('click');
        // 点击reference 显示弹窗
        // 1. show popper <=> vm.$data.showPopper = true
        // 2. emit 'show' 事件
        expect(wrapper.vm.$data.showPopper).toBe(true);
        expect(wrapper.emitted().show).toBeTruthy();

        const a = document.createElement('a');
        document.body.appendChild(a);
        a.click();
        // 点击别的地方 收起弹窗
        // 1. hide popper <=> vm.$data.showPopper = false
        // 2. emit 'hide' 事件
        expect(wrapper.vm.$data.showPopper).toBe(false);
        expect(wrapper.emitted().hide).toBeTruthy();
    });

    it('向popover组件添加自定义的类名', () => {
        const wrapper = mount(Popover, {
            propsData: {
                popperClass: 'my-class'
            }
        });
        expect(wrapper.contains('.my-class')).toBe(true);
    });
});
