import Vue from 'vue';
import Loading from './index.vue';
import { addClass, removeClass, getStyle } from 'rz/utils/dom';
import { PopupManager } from 'rz/utils/popup';
import afterLeave from 'rz/utils/after-leave';
import { t } from 'rz/locale';

const Mask = Vue.extend(Loading);

const loadingDirective = {
  name: 'loading',
  useInstall: true
};
loadingDirective.install = Vue => {
  if (Vue.prototype.$isServer) return;

  const insertDom = (parent, el, binding) => {
    if (!el.domVisible && getStyle(el, 'display') !== 'none' && getStyle(el, 'visibility') !== 'hidden') {
      Object.keys(el.maskStyle).forEach(property => {
        el.mask.style[property] = el.maskStyle[property];
      });

      if (el.originalPosition !== 'absolute' && el.originalPosition !== 'fixed') {
        addClass(parent, 'rz-loading-parent--relative');
      }
      if (binding.modifiers.fullscreen && binding.modifiers.lock) {
        addClass(parent, 'rz-loading-parent--hidden');
      }
      el.domVisible = true;

      parent.appendChild(el.mask);
      Vue.nextTick(() => {
        if (el.instance.hiding) {
          el.instance.$emit('after-leave');
        } else {
          el.instance.visible = true;
        }
      });
      el.domInserted = true;
    }
  };
  const toggleLoading = (el, binding) => {
    if (binding.value) {
      Vue.nextTick(() => {
        if (binding.modifiers.fullscreen) {
          el.originalPosition = getStyle(document.body, 'position');
          el.originalOverflow = getStyle(document.body, 'overflow');
          el.maskStyle.zIndex = PopupManager.nextZIndex();

          addClass(el.mask, 'is-fullscreen');
          insertDom(document.body, el, binding);
        } else {
          removeClass(el.mask, 'is-fullscreen');

          if (binding.modifiers.body) {
            el.originalPosition = getStyle(document.body, 'position');

            ['top', 'left'].forEach(property => {
              const scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';
              el.maskStyle[property] = el.getBoundingClientRect()[property] +
                document.body[scroll] +
                document.documentElement[scroll] -
                parseInt(getStyle(document.body, `margin-${ property }`), 10) +
                'px';
            });
            ['height', 'width'].forEach(property => {
              el.maskStyle[property] = el.getBoundingClientRect()[property] + 'px';
            });

            insertDom(document.body, el, binding);
          } else {
            el.originalPosition = getStyle(el, 'position');
            insertDom(el, el, binding);
          }
        }
      });
    } else {
      // eslint-disable-next-line
      afterLeave(el.instance, _ => {
        el.domVisible = false;
        const target = binding.modifiers.fullscreen || binding.modifiers.body
          ? document.body
          : el;
        removeClass(target, 'rz-loading-parent--relative');
        removeClass(target, 'rz-loading-parent--hidden');
        el.instance.hiding = false;
      }, 300, true);
      el.instance.visible = false;
      el.instance.hiding = true;
    }
  };


  Vue.directive('loading', {
    bind: function(el, binding, vnode) {
      const textExr = el.getAttribute('razor-loading-text') || t('el.loading.loading');
      const textFontSizeExr = el.getAttribute('razor-loading-text-font-size') || 16;
      const spinnerFontSizeExr = el.getAttribute('razor-loading-spinner-font-size') || 48;
      const spinnerExr = el.getAttribute('razor-loading-spinner');
      const backgroundExr = el.getAttribute('razor-loading-background');
      const customClassExr = el.getAttribute('razor-loading-custom-class');
      const vm = vnode.context;
      const mask = new Mask({
        el: document.createElement('div'),
        data: {
          text: vm && vm[textExr] || textExr,
          spinner: vm && vm[spinnerExr] || spinnerExr,
          textFontSize: textFontSizeExr,
          spinnerFontSize: spinnerFontSizeExr,
          background: vm && vm[backgroundExr] || backgroundExr,
          customClass: vm && vm[customClassExr] || customClassExr,
          fullscreen: !!binding.modifiers.fullscreen
        }
      });
      el.instance = mask;
      el.mask = mask.$el;
      el.maskStyle = {};

      binding.value && toggleLoading(el, binding);
    },

    update: function(el, binding) {
      el.instance.setText(el.getAttribute('razor-loading-text'));
      if (binding.oldValue !== binding.value) {
        toggleLoading(el, binding);
      }
    },

    unbind: function(el, binding) {
      if (el.domInserted) {
        el.mask &&
        el.mask.parentNode &&
        el.mask.parentNode.removeChild(el.mask);
        toggleLoading(el, { value: false, modifiers: binding.modifiers });
      }
      el.instance && el.instance.$destroy();
    }
  });
};

export default loadingDirective;
