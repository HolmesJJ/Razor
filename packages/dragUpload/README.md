
<script>
  export default {
    data(){
      return{
        imgList:[],
        myDisplay:false,
        showModel:false,
      }
    },
    
    methods:{
      makeList(){
        let length = 126;
        while(length--){
          const imageSuffix = length + 1;
          const image =  require(`doc/assets/images/dragLoading/globalLoading${imageSuffix}.png`);
          this.imgList.push(image)
        }
      },
      changeSlot(){
        this.myDisplay = !this.myDisplay;
        const message = this.myDisplay? `切换自定义成功`:`切换默认动画成功`
        this.$message({type:'success',message})
      },
      handleVisibleChange(){
        console.log('VisibleChange')
      },
      beforeUpload(file){
        console.log(`上传前`,file)
      },
      onError(err, file, fileList){
        this.showModel = false;
        console.error(err, file, fileList)
        const message = `上传失败`;
        this.$message({type:'error',message})
      },
      onSuccess(response, file, fileList){
        this.showModel = false;
        console.log(response, file, fileList)
        const message = `上传成功`;
        this.$message({type:'success',message})
      },
      onProgress(event, file, fileList){
        console.log(event, file, fileList)
      },
      onChange(file, fileList){
        this.showModel = false;
        console.log(file, fileList)
      },
      showUplaod(){
        this.showModel = true;
      }
    },

    created(){
      this.makeList();
    },
  }
</script>
# DragUpload
## 默认提供拖拽动画版本
```s
Tips: 需要提供图片路径列表,拖拽文件到网页中显示效果
  建议一个页面中只存在一个 `rz-drag-upload`,因为拖拽文件监听是全局的。
1> 可以通过`mask-image-list` 改写默认的图片列表
2> 指定 slot `display` ,uploadMask 会使用自定义的元素进行渲染
```

:::demo 
```html
<rz-button type="default" @click="changeSlot">切换显示</rz-button>

<rz-button type="primary" @click="showUplaod">点击触发显示</rz-button>

<rz-drag-upload 
  multiple
  action="https://jsonplaceholder.typicode.com/posts/"
  :before-upload="beforeUpload"
  :on-error="onError"
  :on-success="onSuccess"
  :on-progress="onChange"
  :on-change="onProgress"
  :show-model="showModel"
  @visibleChange="handleVisibleChange"
  :mask-image-list="imgList">
  <div v-if="myDisplay" slot="display" style="background:#ccc">
    <img :src="imgList[1]">
  </div>
</rz-drag-upload>

<script>
  export default {
    data(){
      return{
        imgList:[],
        myDisplay:false,
        showModel:true,
      }
    },
    
        methods:{
      makeList(){
        let length = 126;
        while(length--){
          const imageSuffix = length + 1;
          const image =  require(`doc/assets/images/dragLoading/globalLoading${imageSuffix}.png`);
          this.imgList.push(image)
        }
      },
      changeSlot(){
        this.myDisplay = !this.myDisplay;
        const message = this.myDisplay? `切换自定义成功`:`切换默认动画成功`
        this.$message({type:'success',message})
      },
      handleVisibleChange(state){
        console.log('VisibleChange',state)
      },
      beforeUpload(file){
        console.log(`上传前`,file)
      },
      onError(err, file, fileList){
        this.showModel = false;
        console.error(err, file, fileList)
        const message = `上传失败`;
        this.$message({type:'error',message})
      },
      onSuccess(response, file, fileList){
        this.showModel = false;
        console.log(response, file, fileList)
        const message = `上传成功`;
        this.$message({type:'success',message})
      },
      onProgress(event, file, fileList){
        console.log(event, file, fileList)
      },
      onChange(file, fileList){
        this.showModel = false;
        console.log(file, fileList)
      },
    },

    created(){
      this.makeList();
    },
  }
</script>
```
:::

### Attribute
| 参数             | 说明                                                                                                                                 | 类型                               | 可选值                    | 默认值      |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- | ------------------------- | ----------- |
| action           | 必选参数，上传的地址                                                                                                                 | string                             | —                        | —          |
| mask-image-list  | 可选参数,接受渲染动画图片文件路径列表                                                                                                | string[]                           | []                        | [string...] |
| headers          | 设置上传的请求头部                                                                                                                   | object                             | —                        | —          |
| multiple         | 是否支持多选文件                                                                                                                     | boolean                            | —                        | —          |
| data             | 上传时附带的额外参数                                                                                                                 | object                             | —                        | —          |
| name             | 上传的文件字段名                                                                                                                     | string                             | —                        | file        |
| with-credentials | 支持发送 cookie 凭证信息                                                                                                             | boolean                            | —                        | false       |
| show-file-list   | 是否显示已上传文件列表                                                                                                               | boolean                            | —                        | true        |
| accept           | 接受上传的[文件类型](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-accept)（thumbnail-mode 模式下此参数无效） | string                             | —                        | —          |
| on-preview       | 点击文件列表中已上传的文件时的钩子                                                                                                   | function(file)                     | —                        | —          |
| on-remove        | 文件列表移除文件时的钩子                                                                                                             | function(file, fileList)           | —                        | —          |
| on-success       | 文件上传成功时的钩子                                                                                                                 | function(response, file, fileList) | —                        | —          |
| on-error         | 文件上传失败时的钩子                                                                                                                 | function(err, file, fileList)      | —                        | —          |
| on-progress      | 文件上传时的钩子                                                                                                                     | function(event, file, fileList)    | —                        | —          |
| on-change        | 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用                                                                       | function(file, fileList)           | —                        | —          |
| before-upload    | 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。                                        | function(file)                     | —                        | —          |
| before-remove    | 删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止上传。                              | function(file, fileList)           | —                        | —          |
| list-type        | 文件列表的类型                                                                                                                       | string                             | text/picture/picture-card | text        |
| auto-upload      | 是否在选取文件后立即进行上传                                                                                                         | boolean                            | —                        | true        |
| file-list        | 上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]                                                       | array                              | —                        | []          |
| http-request     | 覆盖默认的上传行为，可以自定义上传的实现                                                                                             | function                           | —                        | —          |
| disabled         | 是否禁用                                                                                                                             | boolean                            | —                        | false       |
| limit            | 最大允许上传个数                                                                                                                     | number                             | —                        | —          |
| on-exceed        | 文件超出个数限制时的钩子                                                                                                             | function(files, fileList)          | —                        | -           |

### Slot
| name    | 说明           |
| ------- | -------------- |
| display | 自定义展示内容 |

### Methods
| 方法名     | 说明                                                        | 参数                                |
| ---------- | ----------------------------------------------------------- | ----------------------------------- |
| clearFiles | 清空已上传的文件列表（该方法不支持在 before-upload 中调用） | —                                  |
| abort      | 取消上传请求                                                | （ file: fileList 中的 file 对象 ） |
