### MapLinePlayer

<style scoped>
  body {
    margin: 0;
  }
  .map-play {
    width: 800px;
    height: 600px;
    margin: auto;
  }
  .ctrl-group {
    margin: 10px;
  }
  .operator{
    margin: 10px;
  }
</style>
:::demo
```html
<template>
  <div>
    <div class="map-play">
      <rz-s-map
        ref="map"
        :center="center"
        :zoom="zoom"
        :min-zoom="minZoom"
        :max-zoom="maxZoom"
        :config="mapConfig"
      >
        <rz-map-line-player
          v-if="visible"
          ref="linePlayer"
          :stepGap="stepGap"
          :totalStep="totalStep"
          :lines="lines"
          :color-steps="colorSteps"
          :arrow-options="arrowOptions"
          @animate-finish="animateFinish"
          @animate-play="animatePlay"
        >
        </rz-map-line-player>
      </rz-s-map>
    </div>
    <div class="operator">
      <rz-button
        size="mini"
        key="play"
        v-if="!playstate"
        @click="drawAnimateLines"
        >播放</rz-button
      >
      <rz-button
        size="mini"
        key="pause"
        type="plain"
        v-if="playstate"
        @click="stopDrawAnimateLines"
        >暂停</rz-button
      >
      <rz-button size="mini" type="plain" @click="pre"><</rz-button>
      <rz-button size="mini" type="plain" @click="next">></rz-button>
      <rz-slider
        direction="toRight"
        :show-tooltip="false"
        v-model="progress"
        @change="handleSliderChange"
      ></rz-slider>
    </div>
  </div>
</template>
<script>
  const mockArray = [
    {
      start: { lng: 116.404, lat: 39.915 },
      end: { lng: 112.358, lat: 38.918 }
    },
    {
      start: { lng: 112.358, lat: 38.918 },
      end: { lng: 117.3974, lat: 40.49337 }
    },
    {
      start: { lng: 117.3974, lat: 40.49337 },
      end: { lng: 114.358, lat: 40.918 }
    },
    {
      start: { lng: 114.358, lat: 40.918 },
      end: { lng: 116.404, lat: 39.915 }
    }
  ];
  const defaultColor = '#6b38b8';
  const defaultBColor = '#0faa9c';
  function hex2rgba(hexColor, opacity) {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const result = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    return result;
  }

  export default {
    data() {
      return {
        mapConfig: {
          type: 'baidu',
          content: {
            url:
              'http://api.map.baidu.com/getscript?v=3.0&ak=ecLlUVteVbnznhXOD2ad67bcmrQgOKi8&services=&t=20171031174121',
            theme: 'midnight'
          },
          setting: {
            center: [116.404, 39.915],
            zoom: 8,
            minZoom: 3,
            maxZoom: 17
          }
        },
        center: [116.404, 39.915],
        zoom: 8,
        minZoom: 3,
        maxZoom: 17,
        lines: [],
        totalStep: 60, // 步进速度
        stepGap: 1,
        progress: 0,
        playstate: false,
        visible: true,
        colorSteps: [
          { distance: 0, color: hex2rgba(defaultColor, 0.8) },
          { distance: 0.2, color: hex2rgba(defaultColor, 0.6) },
          { distance: 0.4, color: hex2rgba(defaultColor, 0.2) },
          { distance: 0.6, color: hex2rgba(defaultColor, 0.3) },
          { distance: 0.8, color: hex2rgba(defaultBColor, 0.6) },
          { distance: 1, color: hex2rgba(defaultBColor, 0.8) }
        ],
        arrowOptions: {
          strokeStyle: '#68cdfa',
          colorFill: ['#68cdfa', '#68cdfa']
        }
      };
    },
    watch: {
      progress(value) {
        if (this.playstate) {
          return;
        }
        this.$refs.linePlayer.changeProgress(this.progress);
      }
    },
    created() {
      this.lines = [...mockArray];
    },
    methods: {
      handleSliderChange() {
        this.playstate = false;
        this.$refs.linePlayer.changeProgress(this.progress);
      },

      drawAnimateLines() {
        this.playstate = true;
        this.$refs.linePlayer.drawAnimateLines();
      },

      changeLines() {
        for (let i = 0; i < 25; i++) {
          this.lines = this.lines.concat(
            mockArray.map(item => {
              const _item = JSON.parse(JSON.stringify(item));
              _item.start.lng = Number(
                (_item.start.lng - Math.random() * 1.8).toFixed(3)
              );
              _item.start.lat = Number(
                (_item.start.lat - Math.random() * 1.8).toFixed(3)
              );
              _item.end.lat = Number(
                (_item.end.lat - Math.random() * 1.8).toFixed(3)
              );
              _item.end.lng = Number(
                (_item.end.lng - Math.random() * 1.8).toFixed(3)
              );
              return _item;
            })
          );
        }
      },

      stopDrawAnimateLines() {
        this.playstate = false;
        this.$refs.linePlayer.stopDrawAnimateLines();
      },

      pre() {
        const slideStep = 100 / this.lines.length;
        if (this.progress < slideStep) {
          this.progress = 0;
        } else {
          this.progress = this.progress - slideStep;
        }
        this.playstate = false;
        this.$refs.linePlayer.changeProgress(this.progress);
      },

      next() {
        const slideStep = 100 / this.lines.length;
        this.progress = Math.min(100, this.progress + slideStep);
        this.playstate = false;
        this.$refs.linePlayer.changeProgress(this.progress);
      },

      animatePlay({ progress }) {
        this.progress = progress;
      },

      animateFinish() {
        this.playstate = false;
      },

      changeStep() {
        // 改变步进速度
        this.progress = 0;
        this.playstate = false;
        this.totalStep = this.totalStep - 1;
      }
    }
  };
</script>
```

:::

### MapLinePlayer Attributes

| 参数          | 说明                      | 类型                                                          | 可选值                                                          | 默认值     |
| ------------- | ------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------- | ---------- |
| **lines**     | **轨迹的坐标数组,必选项** | array                                                         | [start: {lng:number,lat:number}, end:{lng: number,lat:number},] | []         |
| color-steps   | 可选参数 绘制轨迹的参数   | { distance: 0, color: hex2rgba(defaultColor, 0.8) }[] 如 demo |                                                                 | 有默认选项 |
| arrow-options | 可选参数 箭头绘制的参数   | { strokeStyle: string, colorFill: [string, string] } 如 demo  |                                                                 | 有默认选项 |

### MapLinePlayer Events

| 事件名称       | 说明             | 回调参数                                       |
| -------------- | ---------------- | ---------------------------------------------- |
| animate-finish | 绘制动画轨迹结束 | true                                           |
| animate-play   | 进行绘制动画     | { progress: number } progress 是当前动画的进度 |
