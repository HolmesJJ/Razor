<template>
  <div
    class="rz-table"
    :class="[{
      'rz-table__empty': !data || data.length === 0,
      'rz-table--fit': fit,
      'rz-table--striped': stripe,
      'rz-table--border': border || isGroup,
      'rz-table--hidden': isHidden,
      'rz-table--group': isGroup,
      'rz-table--fluid-height': maxHeight,
      'rz-table--scrollable-x': layout.scrollX,
      'rz-table--scrollable-y': layout.scrollY,
      'rz-table--enable-row-hover': !store.states.isComplex,
      'rz-table--enable-row-transition': (store.states.data || []).length !== 0 && (store.states.data || []).length < 100
    }, tableSize ? `rz-table--${ tableSize }` : '']"
    @mouseleave="handleMouseLeave($event)"
  >
    <div class="hidden-columns" ref="hiddenColumns">
      <slot></slot>
    </div>
    <div
      v-if="showHeader"
      v-mousewheel="handleHeaderFooterMousewheel"
      class="rz-table__header-wrapper"
      ref="headerWrapper"
    >
      <rz-table-header
        ref="tableHeader"
        :store="store"
        :border="border"
        :default-sort="defaultSort"
        :style="{
          width: layout.bodyWidth ? layout.bodyWidth + 'px' : ''
        }"
      ></rz-table-header>
    </div>
    <div
      class="rz-table__body-wrapper"
      ref="bodyWrapper"
      :class="[layout.scrollX ? `is-scrolling-${scrollPosition}` : 'is-scrolling-none']"
      :style="[bodyHeight]"
    >
      <rz-table-body
        :context="context"
        :store="store"
        :stripe="stripe"
        :row-class-name="rowClassName"
        :row-style="rowStyle"
        :highlight="highlightCurrentRow"
        :style="{
           width: bodyWidth
        }"
      ></rz-table-body>
      <!-- <rz-placeholder 
        v-if="!data || data.length === 0"
        ref="emptyBlock"
        :custom-style="emptyCustomStyle"
        :empty-text="emptyText"
        :backgroundImage='emptyBackgroundImage'
        :style="{
          width: bodyWidth
        }">
           <slot name="empty" slot="empty"></slot>
      </rz-placeholder>-->
      <div
        class="rz-table__empty-block"
        v-if="!data || data.length === 0"
        ref="emptyBlock"
        :style="{
          width: bodyWidth,
          ...emptyCustomStyle
        }"
      >
        <span class="rz-table__empty-text">
          <slot name="empty">
            <p>
              <i class="rz-icon-warning" :class="[emptyIcon]"></i>
              {{ emptyText || t('el.table.emptyText') }}
            </p>
          </slot>
        </span>
      </div>
      <div v-if="$slots.append" class="rz-table__append-wrapper" ref="appendWrapper">
        <slot name="append"></slot>
      </div>
    </div>
    <div
      v-if="showSummary"
      v-show="data && data.length > 0"
      v-mousewheel="handleHeaderFooterMousewheel"
      class="rz-table__footer-wrapper"
      ref="footerWrapper"
    >
      <rz-table-footer
        :store="store"
        :border="border"
        :sum-text="sumText || t('el.table.sumText')"
        :summary-method="summaryMethod"
        :default-sort="defaultSort"
        :style="{
          width: layout.bodyWidth ? layout.bodyWidth + 'px' : ''
        }"
      ></rz-table-footer>
    </div>
    <div
      v-if="fixedColumns.length > 0"
      v-mousewheel="handleFixedMousewheel"
      class="rz-table__fixed"
      ref="fixedWrapper"
      :style="[{
        width: layout.fixedWidth ? layout.fixedWidth + 'px' : ''
      },
      fixedHeight]"
    >
      <div v-if="showHeader" class="rz-table__fixed-header-wrapper" ref="fixedHeaderWrapper">
        <rz-table-header
          ref="fixedTableHeader"
          fixed="left"
          :border="border"
          :store="store"
          :style="{
            width: bodyWidth
          }"
        ></rz-table-header>
      </div>
      <div
        class="rz-table__fixed-body-wrapper"
        ref="fixedBodyWrapper"
        :style="[{
          top: layout.headerHeight + 'px'
        },
        fixedBodyHeight]"
      >
        <rz-table-body
          fixed="left"
          :store="store"
          :stripe="stripe"
          :highlight="highlightCurrentRow"
          :row-class-name="rowClassName"
          :row-style="rowStyle"
          :style="{
            width: bodyWidth
          }"
        ></rz-table-body>
        <div
          v-if="$slots.append"
          class="rz-table__append-gutter"
          :style="{
            height: layout.appendHeight + 'px'
          }"
        ></div>
      </div>
      <div
        v-if="showSummary"
        v-show="data && data.length > 0"
        class="rz-table__fixed-footer-wrapper"
        ref="fixedFooterWrapper"
      >
        <rz-table-footer
          fixed="left"
          :border="border"
          :sum-text="sumText || t('el.table.sumText')"
          :summary-method="summaryMethod"
          :store="store"
          :style="{
            width: bodyWidth
          }"
        ></rz-table-footer>
      </div>
    </div>
    <div
      v-if="rightFixedColumns.length > 0"
      v-mousewheel="handleFixedMousewheel"
      class="rz-table__fixed-right"
      ref="rightFixedWrapper"
      :style="[{
        width: layout.rightFixedWidth ? layout.rightFixedWidth + 'px' : '',
        right: layout.scrollY ? (border ? layout.gutterWidth : (layout.gutterWidth || 0)) + 'px' : ''
      },
      fixedHeight]"
    >
      <div v-if="showHeader" class="rz-table__fixed-header-wrapper" ref="rightFixedHeaderWrapper">
        <rz-table-header
          ref="rightFixedTableHeader"
          fixed="right"
          :border="border"
          :store="store"
          :style="{
            width: bodyWidth
          }"
        ></rz-table-header>
      </div>
      <div
        class="rz-table__fixed-body-wrapper"
        ref="rightFixedBodyWrapper"
        :style="[{
          top: layout.headerHeight + 'px'
        },
        fixedBodyHeight]"
      >
        <rz-table-body
          fixed="right"
          :store="store"
          :stripe="stripe"
          :row-class-name="rowClassName"
          :row-style="rowStyle"
          :highlight="highlightCurrentRow"
          :style="{
            width: bodyWidth
          }"
        ></rz-table-body>
      </div>
      <div
        v-if="showSummary"
        v-show="data && data.length > 0"
        class="rz-table__fixed-footer-wrapper"
        ref="rightFixedFooterWrapper"
      >
        <rz-table-footer
          fixed="right"
          :border="border"
          :sum-text="sumText || t('el.table.sumText')"
          :summary-method="summaryMethod"
          :store="store"
          :style="{
            width: bodyWidth
          }"
        ></rz-table-footer>
      </div>
    </div>
    <div
      v-if="rightFixedColumns.length > 0"
      class="rz-table__fixed-right-patch"
      ref="rightFixedPatch"
      :style="{
        width: layout.scrollY ? layout.gutterWidth + 'px' : '0',
        height: layout.headerHeight + 'px'
      }"
    ></div>
    <div class="rz-table__column-resize-proxy" ref="resizeProxy" v-show="resizeProxyVisible"></div>
  </div>
</template>

<script type="text/babel">
// import RzCheckbox from "pkg/checkbox";
import debounce from "throttle-debounce/debounce";
import { addResizeListener, removeResizeListener } from "rz/utils/resize-event";
import Mousewheel from "rz/directive/mousewheel";
import Locale from "rz/mixins/locale";
import Migrating from "rz/mixins/migrating";
import TableStore from "./table-store";
import RzTableLayout from "./table-layout";
import RzTableBody from "./table-body";
import RzTableHeader from "./table-header";
import RzTableFooter from "./table-footer";
// import RzPlaceholder from "pkg/placeholder";

let tableIdSeed = 1;

export default {
  name: "Table",

  options: {
    name: "Table"
  },

  mixins: [Locale, Migrating],

  directives: {
    Mousewheel
  },

  props: {
    data: {
      type: Array,
      default: function() {
        return [];
      }
    },

    size: String,

    width: [String, Number],

    height: [String, Number],

    maxHeight: [String, Number],

    fit: {
      type: Boolean,
      default: true
    },

    stripe: Boolean,

    border: Boolean,

    rowKey: [String, Function],

    context: {},

    showHeader: {
      type: Boolean,
      default: true
    },

    showSummary: Boolean,

    sumText: String,

    summaryMethod: Function,

    rowClassName: [String, Function],

    rowStyle: [Object, Function],

    cellClassName: [String, Function],

    cellStyle: [Object, Function],

    headerRowClassName: [String, Function],

    headerRowStyle: [Object, Function],

    headerCellClassName: [String, Function],

    headerCellStyle: [Object, Function],

    highlightCurrentRow: Boolean,

    currentRowKey: [String, Number],

    emptyText: String,

    emptyIcon: String,

    expandRowKeys: Array,

    defaultExpandAll: Boolean,

    defaultSort: Object,

    tooltipEffect: String,

    spanMethod: Function,

    selectOnIndeterminate: {
      type: Boolean,
      default: true
    },

    emptyBackgroundImage: {
      type: String,
      default: ""
    },

    emptyCustomStyle: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  components: {
    RzTableHeader,
    RzTableFooter,
    RzTableBody
    // RzPlaceholder
    // RzCheckbox
  },

  methods: {
    getMigratingConfig() {
      return {
        events: {
          expand: "expand is renamed to expand-change"
        }
      };
    },

    setCurrentRow(row) {
      this.store.commit("setCurrentRow", row);
    },

    toggleRowSelection(row, selected) {
      this.store.toggleRowSelection(row, selected);
      this.store.updateAllSelected();
    },

    toggleRowExpansion(row, expanded) {
      this.store.toggleRowExpansion(row, expanded);
    },

    clearSelection() {
      this.store.clearSelection();
    },

    clearFilter() {
      this.store.clearFilter();
    },

    clearSort() {
      this.store.clearSort();
    },

    handleMouseLeave() {
      this.store.commit("setHoverRow", null);
      if (this.hoverState) this.hoverState = null;
    },

    updateScrollY() {
      this.layout.updateScrollY();
      this.layout.updateColumnsWidth();
    },

    handleFixedMousewheel(event, data) {
      const bodyWrapper = this.bodyWrapper;
      if (Math.abs(data.spinY) > 0) {
        const currentScrollTop = bodyWrapper.scrollTop;
        if (data.pixelY < 0 && currentScrollTop !== 0) {
          event.preventDefault();
        }
        if (
          data.pixelY > 0 &&
          bodyWrapper.scrollHeight - bodyWrapper.clientHeight > currentScrollTop
        ) {
          event.preventDefault();
        }
        bodyWrapper.scrollTop += Math.ceil(data.pixelY / 5);
      } else {
        bodyWrapper.scrollLeft += Math.ceil(data.pixelX / 5);
      }
    },

    handleHeaderFooterMousewheel(event, data) {
      const { pixelX, pixelY } = data;
      if (Math.abs(pixelX) >= Math.abs(pixelY)) {
        event.preventDefault();
        this.bodyWrapper.scrollLeft += data.pixelX / 5;
      }
    },

    bindEvents() {
      const { headerWrapper, footerWrapper } = this.$refs;
      const refs = this.$refs;
      let self = this;

      this.bodyWrapper.addEventListener("scroll", function() {
        if (headerWrapper) headerWrapper.scrollLeft = this.scrollLeft;
        if (footerWrapper) footerWrapper.scrollLeft = this.scrollLeft;
        if (refs.fixedBodyWrapper) {
          refs.fixedBodyWrapper.scrollTop = this.scrollTop;
        }
        if (refs.rightFixedBodyWrapper) {
          refs.rightFixedBodyWrapper.scrollTop = this.scrollTop;
        }
        const maxScrollLeftPosition = this.scrollWidth - this.offsetWidth - 1;
        const scrollLeft = this.scrollLeft;
        if (scrollLeft >= maxScrollLeftPosition) {
          self.scrollPosition = "right";
        } else if (scrollLeft === 0) {
          self.scrollPosition = "left";
        } else {
          self.scrollPosition = "middle";
        }
      });

      if (this.fit) {
        addResizeListener(this.$el, this.resizeListener);
      }
    },

    resizeListener() {
      if (!this.$ready) return;
      let shouldUpdateLayout = false;
      const el = this.$el;
      const { width: oldWidth, height: oldHeight } = this.resizeState;

      const width = el.offsetWidth;
      if (oldWidth !== width) {
        shouldUpdateLayout = true;
      }

      const height = el.offsetHeight;
      if ((this.height || this.shouldUpdateHeight) && oldHeight !== height) {
        shouldUpdateLayout = true;
      }

      if (shouldUpdateLayout) {
        this.resizeState.width = width;
        this.resizeState.height = height;
        this.doLayout();
      }
    },

    doLayout() {
      this.layout.updateColumnsWidth();
      if (this.shouldUpdateHeight) {
        this.layout.updateElsHeight();
      }
    },

    sort(prop, order) {
      this.store.commit("sort", { prop, order });
    },

    toggleAllSelection() {
      this.store.commit("toggleAllSelection");
    }
  },

  created() {
    this.tableId = "rz-table_" + tableIdSeed++;
    this.debouncedUpdateLayout = debounce(50, () => this.doLayout());
  },

  computed: {
    tableSize() {
      return this.size || (this.$RAZOR || {}).size;
    },

    bodyWrapper() {
      return this.$refs.bodyWrapper;
    },

    shouldUpdateHeight() {
      return (
        this.height ||
        this.maxHeight ||
        this.fixedColumns.length > 0 ||
        this.rightFixedColumns.length > 0
      );
    },

    selection() {
      return this.store.states.selection;
    },

    columns() {
      return this.store.states.columns;
    },

    tableData() {
      return this.store.states.data;
    },

    fixedColumns() {
      return this.store.states.fixedColumns;
    },

    rightFixedColumns() {
      return this.store.states.rightFixedColumns;
    },

    bodyWidth() {
      const { bodyWidth, scrollY, gutterWidth } = this.layout;
      return bodyWidth ? bodyWidth - (scrollY ? gutterWidth : 0) + "px" : "";
    },

    bodyHeight() {
      if (this.height) {
        return {
          height: this.layout.bodyHeight ? this.layout.bodyHeight + "px" : ""
        };
      } else if (this.maxHeight) {
        return {
          "max-height":
            (this.showHeader
              ? this.maxHeight -
                this.layout.headerHeight -
                this.layout.footerHeight
              : this.maxHeight - this.layout.footerHeight) + "px"
        };
      }
      return {};
    },

    fixedBodyHeight() {
      if (this.height) {
        return {
          height: this.layout.fixedBodyHeight
            ? this.layout.fixedBodyHeight + "px"
            : ""
        };
      } else if (this.maxHeight) {
        let maxHeight = this.layout.scrollX
          ? this.maxHeight - this.layout.gutterWidth
          : this.maxHeight;

        if (this.showHeader) {
          maxHeight -= this.layout.headerHeight;
        }

        maxHeight -= this.layout.footerHeight;

        return {
          "max-height": maxHeight + "px"
        };
      }

      return {};
    },

    fixedHeight() {
      if (this.maxHeight) {
        if (this.showSummary) {
          return {
            bottom: 0
          };
        }
        return {
          bottom:
            this.layout.scrollX && this.data.length
              ? this.layout.gutterWidth + "px"
              : ""
        };
      } else {
        if (this.showSummary) {
          return {
            height: this.layout.tableHeight
              ? this.layout.tableHeight + "px"
              : ""
          };
        }
        return {
          height: this.layout.viewportHeight
            ? this.layout.viewportHeight + "px"
            : ""
        };
      }
    }
  },

  watch: {
    height: {
      immediate: true,
      handler(value) {
        this.layout.setHeight(value);
      }
    },

    maxHeight: {
      immediate: true,
      handler(value) {
        this.layout.setMaxHeight(value);
      }
    },

    currentRowKey(newVal) {
      this.store.setCurrentRowKey(newVal);
    },

    data: {
      immediate: true,
      handler(value) {
        this.store.commit("setData", value);
        if (this.$ready) {
          this.$nextTick(() => {
            this.doLayout();
          });
        }
      }
    },

    expandRowKeys: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.store.setExpandRowKeys(newVal);
        }
      }
    }
  },

  destroyed() {
    if (this.resizeListener) {
      removeResizeListener(this.$el, this.resizeListener);
    }
  },

  mounted() {
    this.bindEvents();
    this.store.updateColumns();
    this.doLayout();

    this.resizeState = {
      width: this.$el.offsetWidth,
      height: this.$el.offsetHeight
    };

    // init filters
    this.store.states.columns.forEach(column => {
      if (column.filteredValue && column.filteredValue.length) {
        this.store.commit("filterChange", {
          column,
          values: column.filteredValue,
          silent: true
        });
      }
    });

    this.$ready = true;
  },

  data() {
    const store = new TableStore(this, {
      rowKey: this.rowKey,
      defaultExpandAll: this.defaultExpandAll,
      selectOnIndeterminate: this.selectOnIndeterminate
    });
    const layout = new RzTableLayout({
      store,
      table: this,
      fit: this.fit,
      showHeader: this.showHeader
    });
    return {
      layout,
      store,
      isHidden: false,
      renderExpanded: null,
      resizeProxyVisible: false,
      resizeState: {
        width: null,
        height: null
      },
      // 是否拥有多级表头
      isGroup: false,
      scrollPosition: "left"
    };
  }
};
</script>
