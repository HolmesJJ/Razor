<template>
  <div :class="['rz-notification-plus', className]" :style="zIndexStyle" v-if="!hidden">
    <!-- notification-plus组件的mini状态，只显示icon -->
    <rz-badge v-if="minified" :value="badgeValue" :hidden="!badgeValue">
      <div :class="['rz-notification-plus__mini', className]" @click="setMiniMode(false)">
        <slot name="mini">
          <rz-icon :name="notificationIcon"></rz-icon>
        </slot>
      </div>
    </rz-badge>
    <!-- notification-plus组件的常规状态，显示推送消息卡片 -->
    <div class="rz-notification-plus__card-container" v-else>
      <!-- 卡片部分 -->
      <div class="rz-notification-plus__card">
        <div v-if="!$slots.card">
          <div class="rz-notification-plus__card-title" @click="setMiniMode(true)">
            <slot name="card-title">
              <rz-icon :name="minifiedIcon"></rz-icon>
            </slot>
          </div>
          <div class="rz-notification-plus__card-content" @click="toggleExpansionStatus">
            <slot name="card-content">
              <span class="rz-notification-plus__content-icon">
                <rz-icon :name="notificationIcon"></rz-icon>
              </span>     
              <span v-if="!dangerouslyUseHTMLString" class="rz-notification-plus__content-text">{{ content }}</span>       
              <span v-else v-html="content" class="rz-notification-plus__content-text"></span>
            </slot>
          </div>
          <div class="rz-notification-plus__card-footer">
            <slot name="card-footer">
              <div class="rz-notification-plus__card-footer-item" @click="clear">
                <span><i :class="[`rz-icon-${clearIcon}`,'rz-notification-plus__footer-icon']" />{{clearText}}</span>
              </div>
              <div class="rz-notification-plus__card-footer-item" @click="toggleExpansionStatus">
                <span v-if="expanded"><i :class="[`rz-icon-${expandIcon}`,'rz-notification-plus__footer-icon']" />{{collapseText}}</span>
                <span v-else><i :class="[`rz-icon-${collapseIcon}`,'rz-notification-plus__footer-icon']" />{{expandText}}</span>
              </div>
            </slot>
          </div>
        </div>
        <div v-else>
          <slot name="card"></slot>
        </div>
      </div>
      <!-- 列表抽屉部分 -->
      <div class="rz-notification-plus__card-panel" v-if="expanded">
        <rz-scrollbar noresize :wrap-style="panelListWrapStyle">
          <slot name="before-list"></slot>
          <ul v-if="listData" :class="['rz-notification-plus__panel-list', panelClassName]">
            <li v-for="(item, idx) in listData" :key="idx">
              <slot name="panel-list-item" :scope="{item, $index: idx}"></slot>
            </li>
          </ul>
          <slot name="after-list"></slot>
        </rz-scrollbar>
      </div>

    </div>
  </div>
</template>
<script lang="ts">

import { Vue, Component, Emit, Prop, Watch } from "vue-property-decorator";
import RzIcon from 'pkg/icon';
import RzBadge from 'pkg/badge';
import RzScrollbar from 'pkg/scrollbar';
import { PopupManager } from "rz/utils/popup";
import Locale from 'rz/mixins/locale';
import { t } from 'rz/locale';

@Component({
  name: 'NotificationPlus',
  mixins: [Locale],
  components: {
    RzIcon,
    RzBadge,
    RzScrollbar
  }
})

export default class NotificationPlus extends Vue {
  minified: boolean = false;
  expanded: boolean = false;
  hidden: boolean = true;

  @Prop({ default: 'bell' })
  notificationIcon: string;
  @Prop()
  badgeValue: number;
  @Prop()
  className: string;
  @Prop({ required: true })
  content: string;
  @Prop({ default: false })
  visible: boolean;
  @Prop({ default: false })
  dangerouslyUseHTMLString: boolean;
  @Prop()
  panelClassName: string;
  @Prop()
  listData: [];
  @Prop({ default: 706 })
  listMaxHeight: number;
  @Prop({ default: t('el.notificationPlus.clear') })
  clearText: string;
  @Prop({ default: t('el.notificationPlus.expand') })
  expandText: string;
  @Prop({ default: t('el.notificationPlus.collapse') })
  collapseText: string;
  @Prop({ default: 'delete' })
  clearIcon: string;
  @Prop({ default: 'arrow-up' })
  expandIcon: string;
  @Prop({ default: 'arrow-down' })
  collapseIcon: string;
  @Prop({ default: 'zoom-out' })
  minifiedIcon: string;

  @Watch('visible')
  handleVisibility(val) {
    this.hidden = !val;
  }

  @Emit('mode-changed')
  setMiniMode(flag) {
    this.minified = flag;
    return flag ? 'mini' : 'card';
  }
  @Emit('expansion-changed')
  toggleExpansionStatus() {
    this.expanded = !this.expanded;
    return this.expanded ? 'expanded' : 'collapsed';
  }
  @Emit('visibility-changed')
  setVisible(flag) {
    this.hidden = !flag;
    return flag ? 'visible' : 'hidden';
  }
  @Emit()
  clear() {}

  get panelListWrapStyle() {
    return `max-height: ${this.listMaxHeight}px;`
  }

  get zIndexStyle() {
    return `z-index: ${PopupManager.topTierZIndex};`
  }

  mounted() {
    if (this.visible) this.hidden = false;

  }
}
</script>

