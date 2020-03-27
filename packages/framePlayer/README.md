### FramePlayer

::: demo

```html
<template>
  <div>
    <div style="margin: 20px">
      <p>
        <span>Video Url</span>
        <rz-input v-model="urlData.videoUrl"></rz-input>
      </p>
      <p>
        <span>VideoWsHost</span>
        <rz-input v-model="urlData.videoWsHost"></rz-input>
      </p>
    </div>
    <div
      class="player-test"
      :style="{width: '100%', height: '460px'}"
      style="margin: 20px"
    >
      <rz-frame-player
        ref="player"
        :type="type"
        :videoConfig="videoConfig"
        :imageList="imageList"
        :videoWsHost="urlData.videoWsHost"
        :videoUrl="urlData.videoUrl"
        :autoPlay="false"
        :cropOperations="cropOperations"
        @next="handleNext"
        @crop-operation-click="handleOpClick"
        @type-change="handleTypeChange"
      ></rz-frame-player>
    </div>
    <rz-button type="primary" @click.native="getScreenshot">获取截图</rz-button>
    <rz-button type="primary" @click.native="changeConfig">修改配置</rz-button>
  </div>
</template>

<script>
  import { downloadFile } from "rz/utils/img";
  export default {
    data() {
      return {
        videoConfig: {
          showFaceRect: true,
          needFaceRect: true
        },
        imageList: [
          {
            src: require("doc/assets/images/videoPlay1.jpg")
          },
          {
            src:
              "http://10.9.244.71:30080/components/osg-default/_/video_face_panoramic/20190918-58de8e8d-000a580ae00936-155d0ab8-0002b580",
            faceBounding: [
              {
                start: { x: 170, y: 423 },
                end: { x: 283, y: 524 }
              }
            ]
          },
          {
            src: require("doc/assets/images/videoPlay2.jpg")
          },
          "http://10.9.244.71:30080/components/osg-default/_/video_face_panoramic/20190919-8f9ce3e4-000a580ae00936-114a9bb8-000260a0",
          require("doc/assets/images/videoPlay3.jpg")
        ],
        urlData: {
          videoUrl:
            "rtsp://10.111.32.42:8554/CgUImgUQQhI4COgHEjMKMQovcnRzcDovLzEwLjIyNC43LjExODo1NTQvMTAwMDIwMTkwOTI1MDIzODIxNDQ0MDE=",
          videoWsHost: "ws://10.9.242.48:10080/rtsp-over-ws"
        },
        cropOperations: [
          {
            label: "查看",
            onClick(base64) {
              console.log(base64);
            },
            children: [
              {
                label: "智能检索",
                onClick() {}
              },
              {
                label: "行人检索",
                onClick() {}
              },
              {
                label: "车辆检索",
                onClick() {}
              },
              {
                label: "检索",
                onClick() {}
              }
            ]
          },
          {
            label: "下载",
            onClick(base64) {
              downloadFile("截图", base64);
            }
          }
        ],
        type:'image'
      };
    },
    methods: {
      handleTypeChange() {
        this.type = this.type === "video"? "image" : 'video'
        // videoFile 使用下面这种方式
        // this.type = this.type === "videoFile"? "image": 'videoFile'
      },
      getScreenshot() {
        this.$refs.player.getScreenshot().then(base64 => {
          downloadFile("截屏", base64);
        });
      },
      handleNext(index) {
        if (index > 0) {
          this.videoConfig.needFaceRect = false;
        }
      },
      changeConfig() {
        this.videoConfig.needFaceRect = false;
      },
      handleOpClick() {
        console.log('crop op clicked!!!');
      }
    }
  };
</script>
```

:::

### Attributes

| 参数                       | 说明                             | 类型                                                                                                                      | 可选值        | 默认值       |
| -------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------- | ------------ |
| type                       | 默认显示的播放类型               | string                                                                                                                    | video , image | 'video'      |
| autoPlay                   | 是否自动播放                     | boolean                                                                                                                   | -             | false        |
| videoUrl                   | 视频播放地址                     | string                                                                                                                    | —             | ''           |
| videoWsHost                | 视频 ws 地址                     | string                                                                                                                    | —             | ''           |
| imageList                  | 图片列表                         | string[] 或 { src, faceBounding[], bodyBounding[]}[], 其中，faceBounding 和 bodyBounding 为框坐标信息，具体数据结构见例子 | —             |              |
| imageDuration              | 图片轮播间隔时长                 | number                                                                                                                    | —             | 2000 （ ms） |
| customWidth                | 播放器宽度                       | number, string                                                                                                            | —             | 100%         |
| customHeight               | 播放器高度                       | number, string                                                                                                            | —             | 100%         |
| faceRectColor              | 人脸框颜色                       | string                                                                                                                    | -             | red          |
| bodyRectColor              | 结构化框颜色                     | string                                                                                                                    | -             | blue         |
| rectWidth                  | 边框的粗细值                     | number                                                                                                                    | -             | 2            |
| cropOperations             | 见例子, 截图完毕之后的操作栏信息 | {label: string, onClick: (base64) => {}, children: [ {label: string, onClick: (base64) => {}}]}                           | -             | -            |
| videoConfig.needPlay       | 是否显示播放按钮                 | boolean                                                                                                                   | -             | true         |
| videoConfig.needSwitcher   | 是否显示类型切换按钮             | boolean                                                                                                                   | -             | true         |
| videoConfig.needCut        | 是否显示截图按钮                 | boolean                                                                                                                   | -             | true         |
| videoConfig.needDownload   | 是否显示下载按钮                 | boolean                                                                                                                   | -             | true         |
| videoConfig.needFullscreen | 是否显示全屏按钮                 | boolean                                                                                                                   | -             | true         |
| videoConfig.needZoom       | 是否显示放大/缩小按钮            | boolean                                                                                                                   | -             | true         |
| videoConfig.canZoom        | 是否可以进行缩放                 | boolean                                                                                                                   | -             | true         |
| videoConfig.needFaceRect   | 是否显示检测人脸框按钮           | boolean                                                                                                                   | -             | true         |
| videoConfig.showFaceRect   | 是否默认开启检测人脸框功能       | boolean                                                                                                                   | -             | false        |
| videoConfig.needBodyRect   | 是否显示检测结构化按钮           | boolean                                                                                                                   | -             | true         |
| videoConfig.showBodyRect   | 是否默认开启检测结构化功能       | boolean                                                                                                                   | -             | false        |
| videoConfig.showController | 是否显示控制栏                   | boolean                                                                                                                   | -             | true         |
| icons.play                 | 播放 icon                        | string                                                                                                                    | -             | -            |
| icons.pause                | 暂停 icon                        | string                                                                                                                    | -             | -            |
| icons.prev                 | 上一帧 icon                      | string                                                                                                                    | -             | -            |
| icons.next                 | 下一帧 icon                      | string                                                                                                                    | -             | -            |
| icons.crop                 | 截图 icon                        | string                                                                                                                    | -             | -            |
| icons.zoomIn               | 放大 icon                        | string                                                                                                                    | -             | -            |
| icons.zoomOut              | 缩小 icon                        | string                                                                                                                    | -             | -            |
| icons.fullscreen           | 全屏 icon                        | string                                                                                                                    | -             | -            |
| icons.cancelFullscreen     | 取消全屏 icon                    | string                                                                                                                    | -             | -            |
| icons.download             | 下载 icon                        | string                                                                                                                    | -             | -            |
| icons.children             | 操作栏有子操作栏时出现的 icon    | string                                                                                                                    | -             | -            |
| fullscreenText             | 全屏操作的提示文字               | string                                                                                                                    | -             | -            |
| cancelFullscreenText       | 退出全屏的操作提示文字           | string                                                                                                                    | -             | -            |

### Methods

| 方法名称      | 说明                          | 参数说明                                           |
| ------------- | ----------------------------- | -------------------------------------------------- |
| play          | 播放                          | —                                                  |
| stop          | 暂停                          | —                                                  |
| zoomIn        | 放大                          | —                                                  |
| zoomOut       | 缩小                          | —                                                  |
| next          | 下一帧 (只有在图片模式下有用) | —                                                  |
| prev          | 上一帧 (只有在图片模式下有用) | -                                                  |
| crop          | 开启/关闭截图                 | -                                                  |
| cancelCrop    | 取消截图                      | -                                                  |
| download      | 下载当前帧/图片               | -                                                  |
| getScreenshot | 获取当前截图                  | 异步函数，返回一个 Promise，返回截屏的 base64 数据 |

### Event

| 方法名称             | 说明                         | 参数说明                          |
| -------------------- | ---------------------------- | --------------------------------- |
| fullscreen           | 全屏                         | —                                 |
| next                 | 切换到下一帧时触发           | index: 当前帧的数组下标           |
| prev                 | 切换到上一帧时触发           | index: 当前帧的数组下标           |
| face-rect-change     | 切换是否检测人脸时触发       | value: boolean 当前是否检人脸     |
| body-rect-chagne     | 切换是否检测结构化时触发     | value: boolean 当前是否检测结构化 |
| type-change          | 当播放类型变化时触发         | 当前播放的类型 'image'/ 'video'   |
| crop-operation-click | 当截图操作菜单被点击之后触发 | -                                 |

### Control Event Notification ($emit) 
| 方法名称               | 说明                              | 参数说明 |
| ---------------------- | --------------------------------- | -------- |
| controlEventPlay       | 点击播放                          | -        |
| controlEventStop       | 点击暂停                          | -        |
| controlEventZoom       | zoom变化                          | -        |
| controlEventZoomIn     | 点击放大                          | -        |
| controlEventZoomOut    | 点击缩小                          | -        |
| controlEventNext       | 点击下一桢 (只有在图片模式下有用) | -        |
| controlEventPrev       | 点击上一帧 (只有在图片模式下有用) | -        |
| controlEventCrop       | 点击截图                          | -        |
| controlEventCancelCrop | 取消截图                          | -        |