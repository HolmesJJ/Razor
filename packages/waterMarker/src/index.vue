<template>
  <div>
    
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  name:'WaterMark',
  watch: {
    visible(val) {
      if (val) {
        if (!this.checkHasMark()) {
          this.$nextTick(() => {
            this.visible && this.init();
          })
        }
      } else {
        if (!this.allowDelete) return; 
        this.removeMaskDiv();
      }
    },
    content(val) { // eslint-disable-line
      if (!this.checkHasMark()) return;
      if (this.allowDelete) {
        this.reset();
      } else {
        this.observer && this.observer.disconnect();
        this.reset();
      }
    },
    allowDelete(val) {
      if (val) {
        this.observer && this.observer.disconnect();
      } else {
        this.monitor();
      }
    }

  }
})
export default class WaterMark extends Vue {
  @Prop({ type: Boolean, default: false })
  readonly visible: boolean;

  @Prop({ type: String, default: 'waterMarker' })
  readonly content: string;

  // 是否允许通过js或开发者工具等途径修改水印DOM节点（水印的id，attribute属性，节点的删除）
  @Prop({ type: Boolean, default: false })
  readonly allowDelete: boolean;

  @Prop({ type: String, default: getComputedStyle(document.body).font })
  readonly font: string;

  @Prop({ type: String, default: 'rgba(86, 102, 141, 1)' })
  readonly color: string;

  maskDiv = {} as any;
  observer = {} as any;


  mounted() {
    // 确认DOM渲染后再执行
    this.$nextTick(() => {
      // 创建水印节点
      this.visible && this.init();
      if (!this.allowDelete) {
        this.monitor();
      }
    })

  }

  init() {
    let canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    canvas.width = 200;
    canvas.height = 130;
    this.maskDiv = document.createElement('div');
    let ctx = canvas.getContext('2d') as any;
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.rotate(30 * Math.PI / 180);
    ctx.fillText(this.content, 30, 20);
    let src = canvas.toDataURL('image/png');
    this.maskDiv.style.position = 'fixed';
    this.maskDiv.style.zIndex = '9999';
    this.maskDiv.id = '_waterMark';
    this.maskDiv.style.top = '30px';
    this.maskDiv.style.left = '0'
    this.maskDiv.style.height = '100%';
    this.maskDiv.style.width = '100%';
    this.maskDiv.style.pointerEvents = 'none';
    this.maskDiv.style.backgroundImage = 'URL(' + src + ')';
    document.body.appendChild(this.maskDiv);
  }

  monitor() {
    let body = document.getElementsByTagName('body')[0];
    let options = {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true,
      attributeOldValue: true,
      characterDataOldValue: true
    };
    this.observer = new MutationObserver(this.callback);
    this.observer.observe(body, options); // 监听body节点
  }

  // DOM改变执行callback
  callback(mutations: any, observer: any) { // eslint-disable-line
    if (this.allowDelete) return;
    // 当attribute属性被修改
    if (mutations[0].target.id === '_waterMark') {
      this.removeMaskDiv()
    }
    // 当id被改变时
    if (mutations[0].attributeName === 'id' && !this.checkHasMark()) {
      this.reset();
    }
    // 当节点被删除
    if (mutations[0].removedNodes[0] && mutations[0].removedNodes[0].id === '_waterMark' && !this.checkHasMark()) {
      this.reset();
    }
  }

  removeMaskDiv() {
    if (!this.checkHasMark()) return;
    document.body.removeChild(this.checkHasMark() as any)
  }

  reset() {
    this.removeMaskDiv();
    this.init();
  }

  checkHasMark() {
    return document.getElementById('_waterMark');
  }
}
</script>
