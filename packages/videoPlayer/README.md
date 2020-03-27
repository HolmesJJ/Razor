### VideoPlayer

:::demo

```html
<template>
  <rz-form :formData="urlData" label-width="80px">
    <rz-form-item label="播放路径">
      <rz-input v-model="urlData.videoUrl"></rz-input>
    </rz-form-item>

    <rz-form-item label="转发地址">
      <rz-input v-model="urlData.videoWSHost"></rz-input>
    </rz-form-item>
  </rz-form>

  <div :style="{width: '100%', height: '400px'}">
    <rz-VideoPlayer
    :autoPlay="autoPlay"
    :videoConfig="videoConfig"
    :imageList="imageList"
    :videoWsHost="urlData.videoWSHost"
    :videoUrl="urlData.videoUrl"
    @playStateChange="handleStateChange"
  >
  </rz-VideoPlayer>
<div>

</template>
<script>
export default {
    data(){
      return {
        autoPlay: true,
        videoConfig: {showController: true},
        imageList: [
          require('doc/assets/images/videoPlay1.jpg'),
          require('doc/assets/images/videoPlay2.jpg'),
          require('doc/assets/images/videoPlay1.jpg'),
          require('doc/assets/images/videoPlay3.jpg'),
        ],
        urlData:{
          videoUrl: 'rtsp://admin:Camerasenset1me@10.9.189.39:554',
          videoWSHost: 'ws://10.9.242.48:10080/rtsp-over-ws',
        }
      }
    },
    methods:{
      handleStateChange(){
        console.log(this.urlData,'*********播放状态改变************')
      }
    }
}
</script>
```

:::

### Attributes

| 参数          | 说明             | 类型           | 可选值 | 默认值                                                                                                                                                    |
| ------------- | ---------------- | -------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| autoPlay      | 是否自动播放     | boolean        | -      | false                                                                                                                                                     |
| videoConfig   | 播放器配置       | object         | —      | { needPlay:true, needCut:true, needImg:true, needDownload:true, needFullScreen:true, needZoom:true, needVideo: true, showController: true, canZoom: true} |
| labelConfig   | 标签配置         | object         | —      | {play: '',pause: '',zoom: '',download: '',fullscreen: '',cut: '',image: '',video: '',pre: '',next: ''}                                                    |
| videoUrl      | 视频播放地址     | string         | —      | ''                                                                                                                                                        |
| videoWsHost   | 视频 ws 地址     | string         | —      | ''                                                                                                                                                        |
| imageList     | 图片列表         | array          | —      | []                                                                                                                                                        |
| imageDuration | 图片轮播间隔时长 | number         | —      | 2000 （ ms）                                                                                                                                              |
| customWidth   | 播放器宽度       | number, string | —      | 100%                                                                                                                                                      |
| customHeight  | 播放器高度       | number, string | —      | 100%                                                                                                                                                      |

### Methods

| 方法名称         | 说明         | 参数说明 |
| ---------------- | ------------ | -------- |
| handleCut        | 触发截图     | —        |
| stopCut          | 取消截图     | —        |
| handleDownload   | 下载         | —        |
| switchVideoPlay  | 切换播放方式 | —        |
| handleFullScreen | 触发全屏     | —        |
| doPlay           | 播放         | -        |
| doStop           | 停止播放     | -        |

### Event

| 方法名称        | 说明         | 参数说明                                               |
| --------------- | ------------ | ------------------------------------------------------ |
| drawEnd         | 裁剪结束     | event：拖拽结束的鼠标事件, base64：所框选图片的 base64 |
| fullscreen      | 全屏         | —                                                      |
| playStateChange | 播放状态改变 | 播放状态 state: true / false                           |
