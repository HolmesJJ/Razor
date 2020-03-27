<script>
import TabNav from "./tab-nav";

export default {
  name: "Tabs",

  options: {
    name: "Tabs"
  },

  components: {
    TabNav
  },

  props: {
    type: {
      type: String,
      default: "bar-shadow"
    },
    activeName: String,
    closable: Boolean,
    addable: Boolean,
    value: {},
    editable: Boolean,
    tabPosition: {
      type: String,
      default: "top"
    },
    beforeLeave: Function,
    stretch: Boolean,
    position: {
      type: String,
      default: "start"
    },
    tabGap: {
      type: Number,
      default: 64
    },
    size: {
      type: String,
      default: "default"
    }
  },

  provide() {
    return {
      rootTabs: this
    };
  },

  data() {
    return {
      currentName: this.value || this.activeName,
      panes: []
    };
  },

  watch: {
    activeName(value) {
      this.setCurrentName(value);
    },
    value(value) {
      this.setCurrentName(value);
    },
    /* eslint-disable-next-line */
    currentName(value) {
      if (this.$refs.nav) {
        this.$nextTick(() => {
          /* eslint-disable-next-line */
          this.$refs.nav.$nextTick(_ => {
            this.$refs.nav.scrollToActiveTab();
          });
        });
      }
    }
  },

  methods: {
    calcPaneInstances(isLabelUpdated = false) {
      if (this.$slots.default) {
        const paneSlots = this.$slots.default.filter(
          vnode =>
            vnode.tag &&
            vnode.componentOptions &&
            vnode.componentOptions.Ctor.options.name === "TabPane"
        );
        // update indeed
        const panes = paneSlots.map(
          ({ componentInstance }) => componentInstance
        );
        const panesChanged = !(
          panes.length === this.panes.length &&
          panes.every((pane, index) => pane === this.panes[index])
        );
        if (isLabelUpdated || panesChanged) {
          this.panes = panes;
        }
      } else if (this.panes.length !== 0) {
        this.panes = [];
      }
    },
    handleTabClick(tab, tabName, event) {
      if (tab.disabled) return;
      this.setCurrentName(tabName);
      this.$emit("tab-click", tab, event);
    },
    handleTabRemove(pane, ev) {
      if (pane.disabled) return;
      ev.stopPropagation();
      this.$emit("edit", pane.name, "remove");
      this.$emit("tab-remove", pane.name);
    },
    handleTabAdd() {
      this.$emit("edit", null, "add");
      this.$emit("tab-add");
    },
    setCurrentName(value) {
      const changeCurrentName = () => {
        this.currentName = value;
        this.$emit("input", value);
      };
      if (this.currentName !== value && this.beforeLeave) {
        const before = this.beforeLeave(value, this.currentName);
        if (before && before.then) {
          before.then(() => {
            changeCurrentName();

            this.$refs.nav && this.$refs.nav.removeFocus();
          });
        } else if (before !== false) {
          changeCurrentName();
        }
      } else {
        changeCurrentName();
      }
    }
  },
  /* eslint-disable-next-line */
  render(h) {
    let {
      type,
      handleTabClick,
      handleTabRemove,
      handleTabAdd,
      currentName,
      panes,
      editable,
      addable,
      tabPosition,
      stretch,
      position
    } = this;

    const newButton =
      editable || addable ? (
        <span
          class="rz-tabs__new-tab"
          on-click={handleTabAdd}
          tabindex="0"
          on-keydown={ev => {
            if (ev.keyCode === 13) {
              handleTabAdd();
            }
          }}
        >
          <i class="rz-icon-plus"></i>
        </span>
      ) : null;

    const navData = {
      props: {
        currentName,
        onTabClick: handleTabClick,
        onTabRemove: handleTabRemove,
        editable,
        type,
        panes,
        stretch,
        position
      },
      ref: "nav"
    };
    const header = (
      <div class={["rz-tabs__header", `is-${tabPosition}`]}>
        {newButton}
        <tab-nav {...navData} tabGap={this.tabGap / 2}></tab-nav>
      </div>
    );
    const panels = <div class="rz-tabs__content">{this.$slots.default}</div>;

    return (
      <div
        class={{
          "rz-tabs": true,
          "rz-tabs--small": this.size === "small",
          "rz-tabs--card": type === "card",
          "rz-tabs--bar-shadow": type === "bar-shadow",
          "rz-tabs--dark-stretch": type === "dark-stretch",
          [`rz-tabs--${tabPosition}`]: true,
          "rz-tabs--border-card": type === "border-card"
        }}
      >
        {tabPosition !== "bottom" ? [header, panels] : [panels, header]}
      </div>
    );
  },

  created() {
    if (!this.currentName) {
      this.setCurrentName("0");
    }

    this.$on("tabLabelChanged", this.calcPaneInstances.bind(null, true));
  },

  mounted() {
    this.calcPaneInstances();
  },

  updated() {
    this.calcPaneInstances();
  }
};
</script>
