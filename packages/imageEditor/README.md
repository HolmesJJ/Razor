<script>
const imgSrc = require('doc/assets/images/videoPlay1.jpg');
// const imgSrc = require('./smallImage.png');
// const imgSrc = require('./smallImage2.png');
const stateMap = {
  none: 0,
  circle: 1,
  screenShot: 2,
  drawRects: 3
};
export default {
  data(){
    return {
      imgSrc,
      showDrawer: true,
      drawState: stateMap.none,
      options: {
        radius: 15,
        drawCircleOption:{
          lineColor: '#68cdfa',
          fillColor: '#ff6060',
          weight: 2,
          opacity: 0.8,
          dashed: false,
          dashedConfig: [5, 5, 5]
        }
      },
      config:{
        circleLength: 3
      },
      rects:[],
      imagePosition:{
          start:{ x: 508, y: 302},
          end: {x: 608, y: 406}
      },
      imagePositionList:[{
          start:{ x: 508, y: 302},
          end: {x: 608, y: 406}
      }],
    }
  },
  created(){
  },
  methods:{
    drawCircle(){
      this.drawState = stateMap.circle;
    },
    screenShot(){
      this.drawState = stateMap.screenShot;
    },
    drawRects(){
      this.rects = [
        {
          vertexes:[{x:1552,y:1075},{x:1405,y:938}],
          options:{
            lineColor: '#68cdfa',
            fillColor: '',
            weight: 2,
            opacity: 0.8,
            dashed: true,
            dashedConfig: [5, 5, 5]
          }
        },
        {
          vertexes:[{x:825,y:547},{x:700,y:414}],
          options:{
            lineColor: '#ffdd00',
            fillColor: '',
            weight: 2,
            opacity: 0.8,
            dashed: true,
            dashedConfig: [5, 5, 5]
          }
        },
        {
          vertexes:[{x:415,y:347},{x:600,y:514}],
          options:{
            lineColor: '#ff6000',
            fillColor: '',
            weight: 2,
            opacity: 0.8,
            dashed: true,
            dashedConfig: [5, 5, 5]
          }
        }
      ];
      this.imagePositionList = [];

      this.drawState = stateMap.drawRects;
    },
    handleDrawCircleDone(circles){
      const notify =  {
        type:'success',
        message: JSON.stringify(circles)
      }
      this.$message(notify)
    },
    handleScreenShotDone(screenShot){
      const [ start, end ] = screenShot;
      this.imagePosition = { start, end };
      this.imagePositionList = [{ start, end }]
    },
    handleDrawCircles(circles){
      console.log('circles',circles)
    },
    handleChangeState(state){
      this.drawState = state;
      console.log("draw state change",state)
    },
    handleSelectRect({rect,index, selectedRects}){
      const { vertexes } = rect;
      const [ start, end ] = vertexes;
      this.imagePosition = {start,end};
      this.imagePositionList = selectedRects.map(item => {
        const [ start, end ] = item; 
        return { start, end } 
      })
    },
    stop() {
      this.drawState = stateMap.none;
    },
    flip(){
      /* 会触发 image-change 事件 */
      this.$refs.editor.flip(this.imgSrc);
    },
    rotate(){
      /* 会触发 image-change 事件 */
      this.$refs.editor.rotate(this.imgSrc)
    },
    imageChange({ base64File, imageUrl }){
      this.imgSrc = imageUrl;
      this.stop();
    },
    zoomIn(){
      this.$refs.editor.handleZoom(true)
    },
    zoomOut(){
      this.$refs.editor.handleZoom(false)
    }
  }
}
</script>
## ImageEditor

### Tips:
```
  Editor 会在生命周期的mounted时候初始化,以拿到原生的Dom 元素, 涉及Editor操作的应在mounted 后执行
```
DrawState 有多个状态 *建议使用常量来作为查询*
```JavaScript
const stateMap = {
  none: 0,
  circle: 1,
  screenShot: 2,
  drawRects: 3
};

```
<style lang="scss" scoped>
.imageEditor-demo{
  background: rgba(#56668D,0.5);
  padding: 16px;
  border-radius: 3px;

  &__editor{
      height:400px; width: 600px;
      background: rgba(#263451,1);
      /* border:1px dashed #3e96d7; */
  }
  ul {
    display: flex;
    padding: 8px 0;
    li{
      cursor:pointer;
      text-align:center;
      list-style:none;
      margin: 0 10px;
      color: #d5d5d5;
      &:hover{
        color: #68CDFA;
      }
      i {
        font-size: 24px;
      }
      span{
        display: inline-block;
        width: 100%;
        line-height: 24px;
        font-size: 12px;
      }
    }
  }
}
.imageEditor-demo{
  &__container{
      display:flex;
  }
}

.imageEditor-image{
  margin-left: 24px;
}


</style>
:::demo
```html
<template>
  <div class="imageEditor-demo">
    <div class="imageEditor-demo__container">
      <div class="imageEditor-demo__editor">
        <rz-image-editor 
          mode="multiple"
          :drawState="drawState" 
          :showDrawer="showDrawer" 
          :options="options" 
          :config="config"
          :rects="rects"
          ref="editor"
          @screenshot-done="handleScreenShotDone"
          @draw-circle-done="handleDrawCircleDone"
          @draw-circles="handleDrawCircles"
          @change-state="handleChangeState"
          @select-rect="handleSelectRect"
          @flip-image="imageChange"
          @rotate-image="imageChange"
          :imageSrc="imgSrc">
        </rz-image-editor>
      </div>
      <div style="width: 128px; padding: 0 4px;">
        <rz-image class="imageEditor-image" 
          style="margin: 8px 0" 
          :key="index"
          v-for="position,index in imagePositionList" :src="imgSrc"
          width="128"
          height="112"
          :bounding="position">
        </rz-image>
      </div>
    </div>
    <ul style="margin:10px;" class="editor-list">
      <li @click="drawCircle">
        <rz-icon name="more-outline"></rz-icon><span>标注</span>
      </li>
      <li @click="screenShot">
        <rz-icon name="news"></rz-icon><span>截屏</span>
      </li>
      <li @click="drawRects">
        <rz-icon name="picture-outline"></rz-icon><span>选择</span>
      </li>
      <li @click="rotate">
        <rz-icon name="refresh"></rz-icon><span>旋转</span>
      </li>
      <li @click="flip">
        <rz-icon name="picture"></rz-icon><span>镜像</span>
      </li>    
      <li @click="stop">
        <rz-icon name="circle-close-outline"></rz-icon><span>停止</span>
      </li>  
      <li @click="zoomIn">
        <rz-icon label="icon-enlarge"></rz-icon><span>放大</span>
      </li>    
      <li @click="zoomOut">
        <rz-icon label="icon-narrow"></rz-icon><span>缩小</span>
      </li>      
    </ul>
  </div>
</template>
<script>
const imgSrc = require('doc/assets/images/videoPlay1.jpg');
// const imgSrc = require('./smallImage.png');
// const imgSrc = require('./smallImage2.png');
const stateMap = {
  none: 0,
  circle: 1,
  screenShot: 2,
  drawRects: 3
};
export default {
  data(){
    return {
      imgSrc,
      showDrawer: true,
      drawState: stateMap.none,
      options: {
        radius: 15,
        drawCircleOption:{
          dashed: false,
        }
      },
      config:{
        circleLength: 3
      },
      rects:[],
      imagePosition:{
          start:{ x: 508, y: 302},
          end: {x: 608, y: 406}
      },
      imagePositionList:[{
        start:{ x: 508, y: 302},
        end: {x: 608, y: 406}
      }],
    }
  },
  created(){
  },
  methods:{
    drawCircle(){
      this.drawState = stateMap.circle;
    },
    screenShot(){
      this.drawState = stateMap.screenShot;
    },
    drawRects(){
      this.rects = [
        {
          vertexes:[{x:1552,y:1075},{x:1405,y:938}],
          options:{
            lineColor: '#68cdfa',
            fillColor: '#ffffff',
            weight: 2,
            opacity: 0.8,
            dashed: true,
            dashedConfig: [5, 5, 5]
          }
        },
        {
          vertexes:[{x:825,y:547},{x:700,y:414}],
          options:{
            lineColor: '#ffdd00',
            fillColor: '#ffdd00',
            weight: 2,
            opacity: 0.8,
            dashed: true,
            dashedConfig: [5, 5, 5]
          }
        },
        {
          vertexes:[{x:415,y:347},{x:600,y:514}],
          options:{
            lineColor: '#ff6000',
            fillColor: '#ff6000',
            weight: 2,
            opacity: 0.8,
            dashed: true,
            dashedConfig: [5, 5, 5]
          }
        }
      ]
      this.imagePositionList = []
      this.drawState = stateMap.drawRects;
    },
    handleDrawCircleDone(circles){
      const notify =  {
        type:'success',
        message: JSON.stringify(circles)
      }
      this.$message(notify)
    },
    handleScreenShotDone(screenShot){
      const [ start, end ] = screenShot;
      this.imagePosition = { start, end };
      this.imagePositionList = [{ start, end }]
    },
    handleDrawCircles(circles){
      console.log('circles',circles)
    },
    handleChangeState(state){
      this.drawState = state;
      console.log("draw state change",state)
    },
    handleSelectRect({rect, index, selectedRects}){
      const { vertexes } = rect;
      const [ start, end ] = vertexes;
      this.imagePosition = { start, end };
      this.imagePositionList = selectedRects.map(item => {
        const [ start, end ] = item;
        return { start, end } 
      })
    },
    stop() {
      this.drawState = stateMap.none;
    },
    flip(){
      /* 会触发 image-change 事件 */
      this.$refs.editor.flip(this.imgSrc);
    },
    rotate(){
      /* 会触发 image-change 事件 */
      this.$refs.editor.rotate(this.imgSrc)
    },
    imageChange({ base64File, imageUrl }){
      this.imgSrc = imageSrc;
      this.stop();
    }
  }
}
</script>
```
:::


### ImageEditor  Attribute 参数列表
| 参数       | 说明                               | 类型                                                     | 可选值           | 默认值 |
| ---------- | ---------------------------------- | -------------------------------------------------------- | ---------------- | ------ |
| drawState  | 必填参数，当前编辑器的状态         | number                                                   | 0-3              | 0      |
| showDrawer | 控制编辑器的显示隐藏               | boolean                                                  | —                | true   |
| imageSrc   | 必填参数，控制编辑器的显示隐藏     | string                                                   | —                | ''     |
| options    | 可选参数，控制编辑器的绘画画笔参数 | string                                                   | —                | ''     |
| config     | 可选参数，控制编辑器的配置         | config:{ circleLength: number  },  circleLength 默认是10 | —                | ''     |
| rects      | 必填参数，编辑器要绘制的矩形       | array 具体array 元素的可以看下demo drawRects 方法        | —                | []     |
| mode       | 可选参数，编辑器矩形选择可选模式   | string                                                   | radio , multiple | radio  |

### ImageEditor Events 事件列表

| 事件名称         | 说明                                                  | 回调参数                 |
| ---------------- | ----------------------------------------------------- | ------------------------ |
| draw-circles     | 在 用户画圆的时候触发                                 | circles:[]               |
| draw-circle-done | 在 用户画圆圆的个数到达 circleLength 限定值的时候触发 | circles:[]               |
| change-state     | 在 绘画状态 发生改变的时候触发                        | state:number             |
| screenshot-done  | 在 截屏完成的时候触发                                 | screenShot               |
| select-rect      | 在 选择rect 框的时候触发                              | { rect, index }          |
| rotate-image     | 在 旋转图片 的时候触发                                | { base64File, imageUrl } |
| flip-image       | 在 镜像图片的时候触发                                 | { base64File, imageUrl } |

