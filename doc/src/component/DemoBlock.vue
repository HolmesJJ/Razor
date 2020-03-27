<template>
  <div class="demo-block">
    <slot name="demo"></slot>
    <div class="source">
      <div class="source__container" :class="{'source__container--active': controlExtend}">
        <slot name="description"></slot>
        <slot name="source"></slot>
      </div>
      <div
        class="source__control"
        :class="{'source__control--active': controlExtend}"
        @click="toggleContainer"
      >{{controlText}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DemoBlock",
  data() {
    return {
      controlExtend: false
    };
  },
  computed: {
    controlText() {
      return this.controlExtend ? "▲ 隐藏代码" : "▼ 显示代码";
    }
  },

  methods: {
    toggleContainer() {
      this.controlExtend = !this.controlExtend;
    }
  }
};
</script>

<style lang="scss" scoped>
.demo-block {
  box-sizing: border-box;
  border: 1px solid lightgrey;
  border-radius: 4px;
  width: calc(100% - 2px);
  margin-top: 20px;
  margin-bottom: 80px;
  .demo {
    border-radius: 0;
    padding: 20px;
  }
  .source {
    border-radius: 3px;
    &__control {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: gray;
      border-top: 1px solid lightgray;
      cursor: pointer;
      &:hover {
        background-color: rgba(lightblue, 0.5);
      }
      &--active {
        border-top: 1px solid #fff;
      }
    }

    &__container {
      height: 0;
      font-size: 16px;
      overflow: hidden;
      transition: 0.3s all;
      pre {
        margin: 0;

        code {
          font-size: 13px;
          font-family: "Lucida Console", Consolas, Monaco, "Andale Mono",
            "Ubuntu Mono", monospace;
        }
      }
      .highlight {
        padding: 15px;
      }
      &--active {
        min-height: 350px;
        height: auto;
      }
    }
  }
}

.dark {
  .demo {
    color: rgba(255, 255, 255, 1);
    border-radius: 0;
    padding: 20px;
    background: rgba(31, 42, 64, 1);
  }
  .source {
    &__control {
      color: #090d16;
      border-top: 1px solid #fff;
      &:hover {
        background-color: rgba(59, 71, 100, 0.5);
        color: #fff;
      }
      &--active {
        border-top: 1px solid #fff;
      }
    }
  }
}
</style>
