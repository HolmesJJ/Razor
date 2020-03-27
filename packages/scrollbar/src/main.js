// reference https://github.com/noeldelgado/gemini-scrollbar/blob/master/index.js

import { addResizeListener, removeResizeListener } from 'rz/utils/resize-event';
import scrollbarWidth from 'rz/utils/scrollbar-width';
import { toObject } from 'rz/utils/util';
import Bar from './bar';

/* istanbul ignore next */
export default {
  name: 'Scrollbar',

  options: {
    name: 'Scrollbar'
  },

  components: { Bar },

  props: {
    native: Boolean,
    wrapStyle: {},
    wrapClass: {},
    viewClass: {},
    viewStyle: {},
    noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
    tag: {
      type: String,
      default: 'div'
    },
    barType:String,
  },

  data() {
    return {
      sizeWidth: '0',
      sizeHeight: '0',
      moveX: 0,
      moveY: 0
    };
  },

  computed: {
    wrap() {
      return this.$refs.wrap;
    }
  },

  render(h) {
    let gutter = scrollbarWidth();
    let style = this.wrapStyle;

    if (gutter) {
      const gutterWith = `-${gutter}px`;
      const gutterStyle = `margin-bottom: ${gutterWith}; margin-right: ${gutterWith};`;

      if (Array.isArray(this.wrapStyle)) {
        style = toObject(this.wrapStyle);
        style.marginRight = style.marginBottom = gutterWith;
      } else if (typeof this.wrapStyle === 'string') {
        style += gutterStyle;
      } else {
        style = gutterStyle;
      }
    }
    const view = h(this.tag, {
      class: ['rz-scrollbar__view', this.viewClass],
      style: this.viewStyle,
      ref: 'resize'
    }, this.$slots.default);
    const wrap = (
      <div
        ref="wrap"
        style={style}
        onScroll={this.handleScroll}
        class={[this.wrapClass, 'rz-scrollbar__wrap', gutter ? '' : 'rz-scrollbar__wrap--hidden-default']}>
        {[view]}
      </div>
    );
    let nodes;

    const barSlot = this.$slots.barSlot? this.$slots.barSlot : null;

    if (!this.native) {
      nodes = ([
        wrap,
        <Bar
          barType={this.barType}
          move={this.moveX}
          size={this.sizeWidth}>
          {barSlot}
        </Bar>,
        <Bar
          vertical
          barType={this.barType}
          move={this.moveY}
          size={this.sizeHeight}>
          {barSlot}
        </Bar>
      ]);
    } else {
      nodes = ([
        <div
          ref="wrap"
          class={[this.wrapClass, 'rz-scrollbar__wrap']}
          style={style}>
          {[view]}
        </div>
      ]);
    }
    return h('div', { class: 'rz-scrollbar' }, nodes);
  },

  methods: {
    handleScroll(event) {
      const wrap = this.wrap;

      this.moveY = ((wrap.scrollTop * 100) / wrap.clientHeight);
      this.moveX = ((wrap.scrollLeft * 100) / wrap.clientWidth);

      this.$nextTick(()=>{this.emitScrollEvent({ event, moveY: this.moveY, moveX: this.moveX })})
    },

    emitScrollEvent({ event, moveY, moveX }){
      this.$emit('scroll',{ event, moveY, moveX })
    },

    update() {
      let heightPercentage, widthPercentage;
      const wrap = this.wrap;
      if (!wrap) return;

      heightPercentage = (wrap.clientHeight * 100 / wrap.scrollHeight);
      widthPercentage = (wrap.clientWidth * 100 / wrap.scrollWidth);

      this.sizeHeight = (heightPercentage < 100) ? (heightPercentage + '%') : '';
      this.sizeWidth = (widthPercentage < 100) ? (widthPercentage + '%') : '';
    }
  },
  updated() {
    this.update();
  },

  mounted() {
    if (this.native) return;
    this.$nextTick(this.update);
    !this.noresize && addResizeListener(this.$refs.resize, this.update);
  },

  beforeDestroy() {
    if (this.native) return;
    !this.noresize && removeResizeListener(this.$refs.resize, this.update);
  }
};
