import Pager from "./pager.vue";
import RzSelect from "pkg/select";
import RzOption from "pkg/option";
import RzInput from "pkg/input";
import Locale from "rz/mixins/locale";
import { valueEquals } from "rz/utils/util";

export default {
  name: "RzPagination",

  options: {
    name: "Pagination"
  },

  props: {
    pageSize: {
      type: Number,
      default: 10
    },

    small: Boolean,

    total: Number,

    pageCount: Number,

    pagerCount: {
      type: Number,
      validator(value) {
        return (
          (value | 0) === value && value > 4 && value < 22 && value % 2 === 1
        );
      },
      default: 7
    },

    currentPage: {
      type: Number,
      default: 1
    },

    layout: {
      default: "prev, pager, next, jumper, ->, total"
    },

    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 40, 50, 100];
      }
    },

    popperClass: String,

    prevText: String,

    nextText: String,

    background: Boolean,

    disabled: Boolean
  },

  data() {
    return {
      internalCurrentPage: 1,
      internalPageSize: 0,
      lastEmittedPage: -1,
      userChangePageSize: false
    };
  },
  // eslint-disable-next-line
  render(h) {
    let template = (
      <div
        class={[
          "rz-pagination",
          {
            "is-background": this.background,
            "rz-pagination--small": this.small
          }
        ]}
      />
    );
    const layout = this.layout || "";
    if (!layout) return;
    const TEMPLATE_MAP = {
      prev: <prev />,
      jumper: <jumper />,
      pager: (
        <pager
          currentPage={this.internalCurrentPage}
          pageCount={this.internalPageCount}
          pagerCount={this.pagerCount}
          on-change={this.handleCurrentChange}
          disabled={this.disabled}
        />
      ),
      next: <next />,
      sizes: <sizes pageSizes={this.pageSizes} />,
      slot: <my-slot />,
      total: <total />
    };
    const components = layout.split(",").map(item => item.trim());
    const rightWrapper = <div class="rz-pagination__rightwrapper" />;
    let haveRightWrapper = false;

    template.children = template.children || [];
    rightWrapper.children = rightWrapper.children || [];
    components.forEach(compo => {
      if (compo === "->") {
        haveRightWrapper = true;
        return;
      }

      if (!haveRightWrapper) {
        template.children.push(TEMPLATE_MAP[compo]);
      } else {
        rightWrapper.children.push(TEMPLATE_MAP[compo]);
      }
    });

    if (haveRightWrapper) {
      template.children.unshift(rightWrapper);
    }

    return template;
  },

  components: {
    MySlot: {
      // eslint-disable-next-line
      render(h) {
        return this.$parent.$slots.default
          ? this.$parent.$slots.default[0]
          : "";
      }
    },
    Prev: {
      // eslint-disable-next-line
      render(h) {
        return (
          <button
            type="button"
            class="btn-prev"
            disabled={
              this.$parent.disabled || this.$parent.internalCurrentPage <= 1
            }
            on-click={this.$parent.prev}
          >
            {this.$parent.prevText ? (
              <span>{this.$parent.prevText}</span>
            ) : (
              <i class="rz-icon rz-icon-arrow-left" />
            )}
          </button>
        );
      }
    },

    Next: {
      // eslint-disable-next-line
      render(h) {
        return (
          <button
            type="button"
            class="btn-next"
            disabled={
              this.$parent.disabled ||
              this.$parent.internalCurrentPage ===
                this.$parent.internalPageCount ||
              this.$parent.internalPageCount === 0
            }
            on-click={this.$parent.next}
          >
            {this.$parent.nextText ? (
              <span>{this.$parent.nextText}</span>
            ) : (
              <i class="rz-icon rz-icon-arrow-right" />
            )}
          </button>
        );
      }
    },

    Sizes: {
      mixins: [Locale],

      props: {
        pageSizes: Array
      },

      watch: {
        pageSizes: {
          immediate: true,
          handler(newVal, oldVal) {
            if (valueEquals(newVal, oldVal)) return;
            if (Array.isArray(newVal)) {
              this.$parent.internalPageSize =
                newVal.indexOf(this.$parent.pageSize) > -1
                  ? this.$parent.pageSize
                  : this.pageSizes[0];
            }
          }
        }
      },
      // eslint-disable-next-line
      render(h) {
        return (
          <span class="rz-pagination__sizes">
            <rz-select
              value={this.$parent.internalPageSize}
              popperClass={this.$parent.popperClass || ""}
              size="small"
              on-input={this.handleChange}
              disabled={this.$parent.disabled}
            >
              {this.pageSizes.map(item => (
                <rz-option
                  value={item}
                  label={item + this.t("el.pagination.pagesize")}
                />
              ))}
            </rz-select>
          </span>
        );
      },

      components: {
        RzSelect,
        RzOption
      },

      methods: {
        handleChange(val) {
          if (val !== this.$parent.internalPageSize) {
            this.$parent.internalPageSize = val = parseInt(val, 10);
            this.$parent.userChangePageSize = true;
            this.$parent.$emit("update:pageSize", val);
            this.$parent.$emit("size-change", val);
          }
        }
      }
    },

    Jumper: {
      mixins: [Locale],

      components: { RzInput },

      data() {
        return {
          userInput: null
        };
      },

      watch: {
        "$parent.internalCurrentPage"() {
          this.userInput = null;
        }
      },

      methods: {
        handleKeyup({ keyCode, target }) {
          // Chrome, Safari, Firefox triggers change event on Enter
          // Hack for IE: https://github.com/ElemeFE/element/issues/11710
          // Drop this method when we no longer supports IE
          if (keyCode === 13) {
            this.handleChange(target.value);
          }
        },
        handleInput(value) {
          this.userInput = value;
        },
        handleChange(value) {
          this.$parent.internalCurrentPage = this.$parent.getValidCurrentPage(
            value
          );
          this.$parent.emitChange();
          this.userInput = null;
        }
      },
      // eslint-disable-next-line
      render(h) {
        return (
          <span class="rz-pagination__jump">
            {this.t("el.pagination.goto")}
            <rz-input
              class="rz-pagination__editor is-in-pagination"
              min={1}
              max={this.$parent.internalPageCount}
              value={
                this.userInput !== null
                  ? this.userInput
                  : this.$parent.internalCurrentPage
              }
              size="small"
              type="number"
              disabled={this.$parent.disabled}
              nativeOnKeyup={this.handleKeyup}
              onInput={this.handleInput}
              onChange={this.handleChange}
            />
            {this.t("el.pagination.pageClassifier")}
          </span>
        );
      }
    },

    Total: {
      mixins: [Locale],
      // eslint-disable-next-line
      render(h) {
        return typeof this.$parent.total === "number" ? (
          <span class="rz-pagination__total">
            {this.t("el.pagination.total", { total: this.$parent.total })}
          </span>
        ) : (
          ""
        );
      }
    },

    Pager
  },

  methods: {
    handleCurrentChange(val) {
      this.internalCurrentPage = this.getValidCurrentPage(val);
      this.userChangePageSize = true;
      this.emitChange();
    },

    prev() {
      if (this.disabled) return;
      const newVal = this.internalCurrentPage - 1;
      this.internalCurrentPage = this.getValidCurrentPage(newVal);
      this.$emit("prev-click", this.internalCurrentPage);
      this.emitChange();
    },

    next() {
      if (this.disabled) return;
      const newVal = this.internalCurrentPage + 1;
      this.internalCurrentPage = this.getValidCurrentPage(newVal);
      this.$emit("next-click", this.internalCurrentPage);
      this.emitChange();
    },

    getValidCurrentPage(value) {
      value = parseInt(value, 10);

      const havePageCount = typeof this.internalPageCount === "number";

      let resetValue;
      if (!havePageCount) {
        if (isNaN(value) || value < 1) resetValue = 1;
      } else {
        if (value < 1) {
          resetValue = 1;
        } else if (value > this.internalPageCount) {
          resetValue = this.internalPageCount;
        }
      }

      if (resetValue === undefined && isNaN(value)) {
        resetValue = 1;
      } else if (resetValue === 0) {
        resetValue = 1;
      }

      return resetValue === undefined ? value : resetValue;
    },

    emitChange() {
      this.$nextTick(() => {
        if (
          this.internalCurrentPage !== this.lastEmittedPage ||
          this.userChangePageSize
        ) {
          this.$emit("current-change", this.internalCurrentPage);
          this.lastEmittedPage = this.internalCurrentPage;
          this.userChangePageSize = false;
        }
      });
    }
  },

  computed: {
    internalPageCount() {
      if (typeof this.total === "number") {
        return Math.max(1, Math.ceil(this.total / this.internalPageSize));
      } else if (typeof this.pageCount === "number") {
        return Math.max(1, this.pageCount);
      }
      return null;
    }
  },

  watch: {
    currentPage: {
      immediate: true,
      handler(val) {
        this.internalCurrentPage = this.getValidCurrentPage(val);
      }
    },

    pageSize: {
      immediate: true,
      handler(val) {
        this.internalPageSize = isNaN(val) ? 10 : val;
      }
    },

    internalCurrentPage: {
      immediate: true,
      handler(newVal) {
        this.$emit("update:currentPage", newVal);
        this.lastEmittedPage = -1;
      }
    },

    internalPageCount(newVal) {
      /* istanbul ignore if */
      const oldPage = this.internalCurrentPage;
      if (newVal > 0 && oldPage === 0) {
        this.internalCurrentPage = 1;
      } else if (oldPage > newVal) {
        this.internalCurrentPage = newVal === 0 ? 1 : newVal;
        this.userChangePageSize && this.emitChange();
      }
      this.userChangePageSize = false;
    }
  }
};
