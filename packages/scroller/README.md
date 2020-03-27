<script>
export default {
  data(){
    return {
      i:1,
      distance:50,
      disabled:false,
      loading:true,
      list:[
        {label: `原本内容1`}
      ],
      delay:200,

      i2:1,
      disabled2:false,
      loading2:true,
      delay2:200,
      distance2:50,
      immediateCheck2:true,
      list2:[
        {label: `原本内容2`}
      ],
    }
  },
  methods:{
    loadData1(param){
      this.disabled = true;
      this.loading = true;
      // 模拟请求
      setTimeout(this.fetchData,3000)
    },

    loadData2(){
      this.disabled2 = true;
      this.loading2 = true;
      // 模拟请求
      setTimeout(this.fetchData2,3000)
    },

    fetchData(){
      console.log(this.i ,"--------------")
      if(this.i > 10 ){
        this.disabled = true;
      } else {
        this.disabled = false;
      }
      const arr = [];
      let length = 0;
      while(length <= 20){
        arr.push({label: `${this.i}新加内容${length}`})
        length +=1;
      }
      this.list = this.list.concat(arr)
      this.i += 1;
      this.loading = false;
    },

    fetchData2(){
      if(this.i > 10 ){
        this.disabled2 = true;
      } else {
        this.disabled2 = false;
      }
      let length = 0;
      const arr = [];
      while(length <= 20){
        arr.push({label: `${this.i2}新加内容${length}`})
        length +=1;
      }
      this.list2 = this.list2.concat(arr)
      this.i2 += 1;
      this.loading2 = false;
    }
  },
  mounted(){
  }
}
</script>

<style lang="scss" scoped>

  .demo-block .scroller-demo{
    height: 500px;
    overflow-y: scroll;
  }

  .infinite-list-container{
    border: 1px solid rgba(#fff,0.3);
    padding-right: 4px;
    border-radius: 4px;
  }
  .demo-block .demo{
    overflow-x:hidden;
  }
  .demo-block .infinite-list ul{
    list-style: none;
    padding: 10px;
  }
  .demo-block .infinite-list li.item{
    margin:10px;
    border-radius:5px;
    text-align:center;
    border: 1px solid #999;
    border-left: 5px solid #5389F3;
    line-height:80px;
    height: 80px;
  }
  .demo-block .infinite-list li:hover{
    border-color:#5389F3;
    box-shadow: 0px 2px 18px 0px rgba( #001e4d, 0.25);
    transform: scale(1.01) 
  }
   .demo-block .infinite-list li.loading{
    text-align:center;
    margin:10px auto;
  }
  .demo-block .scroller-wrap{
    height:500px;
  }
  .demo-block .scroller-box{
    height: 500px;
    border: 1px solid rgba(#fff,0.3);
    border-radius: 3px;
  }
</style>

### Scroller 无缝滚动

#### 使用指南:

##### directive方式 :

:::demo
```html
<template>
  <div class="infinite-list-container">
    <div class="scroller-demo">
      <div 
        class="infinite-list"
        v-infinite-scroll="loadData2"
        infinite-scroll-distance="distance2"
        infinite-scroll-disabled="disabled2"
        infinite-scroll-immediate-check="immediateCheck2"
        infinite-scroll-throttle-delay="delay2">
          <ul>
            <li class="item" v-for="item in list2">
              {{item.label}}
            </li>
            <li class="loading" v-show="loading2">
              <i class="el-icon-loading"></i>&nbsp;&nbsp;Loading...
            </li>
          </ul>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data(){
    return {
      i2:1,
      disabled2:false,
      loading2:true,
      delay2:200,
      distance2:50,
      immediateCheck2:true,
      list2:[
        {label: `原本内容2`}
      ],
    }
  },
  methods:{
    loadData2(param){
      this.disabled = true;
      // 模拟请求
      setTimeout(this.fetchData2,2000)
    },

    fetchData2(){
      if(this.i2 > 10 ){
        this.disabled = true;
      } else {
        this.disabled = false;
      }
      let length = 20;
      const arr = [];
      while(length--){
        arr.push({label: `${this.i2}新加内容${length}`})
      }
      this.list = this.list.concat(arr)
      this.i2 += 1;
      this.loading2 = false;
    }
  },
  mounted(){
    
  }
  
}
</script>
```
:::

##### component形式:
```tips
  rz-scroller 组件需要设置高度
```
:::demo
```html
<template>
  <rz-scrollbar class="scroller-box" noresize wrap-class="scroller-wrap">
    <rz-scroller
        class="infinite-list"
        immediateCheck
        :delay="0"
        :distance="distance"
        :disabled="disabled"
        :scrollHandler="loadData1">
      
        <ul>
          <li class="item" v-for="item in list">
            {{item.label}}
          </li>
          <li class="loading" v-show="loading">
            <i class="el-icon-loading"></i>&nbsp;&nbsp;Loading...
          </li>
        </ul>
    </rz-scroller>
  </rz-scrollbar>
  <!-- :renderAfterExpand="false" -->
</template>
<script>
export default {
  data(){
    return {
      i:1,
      distance:50,
      disabled:false,
      loading:true,
      list:[
        {label: `原本内容1`}
      ],
      delay:200,
    }
  },
  methods:{
    loadData1(param){
      this.disabled = true;
      this.loading = true;
      // 模拟请求
      setTimeout(this.fetchData,2000)
    },

    fetchData(){
      if(this.i > 10 ){
        this.disabled = true;
      } else {
        this.disabled = false;
      }
      const arr = [];
      while(length <= 20){
        arr.push({label: `${this.i}新加内容${length}`})
        length +=1;
      }
      this.list = this.list.concat(arr)
      this.i += 1
      this.loading = false;
    }
  },
  mounted(){
    
  }
  
}
</script>
```
:::



### scrollbar 组件属性
| 参数      | 说明                                                    | 类型          | 可选值 | 默认值         |
| --------- | ------------------------------------------------------- | ------------- | ------ | -------------- |
| barType   | 滚动条类型                                              | string        | —      | mini 、default |
| native    | 使用原生的滚动                                          | boolean       | —      | —   false      |
| wrapStyle | 包裹容器的style 灵活更改                                | array、string | —      | ''             |
| viewStyle | view视口的style 灵活更改                                | array、string | —      | ''             |
| wrapClass | 包裹容器的class 灵活更改                                | string        | —      | ''             |
| viewClass | view视口的class 灵活更改                                | string        | —      | ''             |
| noresize  | 如果 container 尺寸不会发生变化，最好设置它可以优化性能 | boolean       | —      | false          |

### component 方式 组件属性
| 参数           | 说明                                                                             | 类型           | 可选值 | 默认值       |
| -------------- | -------------------------------------------------------------------------------- | -------------- | ------ | ------------ |
| scrollHandler  | 指定节点选择框是否禁用为节点对象的某个属性值                                     | function       | —      | —            |
| disabled       | 无缝滚动的可用状态                                                               | boolean        | —      | false        |
| immediateCheck | 是否立即检查底部距离,属性为true会立马触发检查满足条件则触发scrollHandler指定函数 | boolean        | —      | false        |
| distance       | 距离底部生效距离                                                                 | number         | —      | 20           |
| delay          | 延迟触发scrollHandler的时延                                                      | number         | —      | 200          |
| height         | (组件才有)父容器的高度                                                           | number ,string | —      | 100%(string) |


### directive 方式 属性
| 参数                            | 说明                                                                                             | 类型     | 可选值 | 默认值 |
| ------------------------------- | ------------------------------------------------------------------------------------------------ | -------- | ------ | ------ |
| v-infinite-scroll               | (scrollHandler)指定节点选择框是否禁用为节点对象的某个属性值                                      | function | —      | —      |
| infinite-scroll-disabled        | (disabled)无缝滚动的可用状态                                                                     | boolean  | —      | false  |
| infinite-scroll-immediate-check | (immediateCheck)是否立即检查底部距离,属性为true会立马触发检查满足条件则触发scrollHandler指定函数 | boolean  | —      | false  |
| infinite-scroll-distance        | (distance)距离底部生效距离                                                                       | number   | —      | 20     |
| infinite-scroll-throttle-delay  | (delay)延迟触发scrollHandler的时延                                                               | number   | —      | 200    |

### event 事件
| 事件名称 | 说明            | 回调参数             |
| -------- | --------------- | -------------------- |
| scroll   | scroll 滚动事件 | {event moveX, moveY} |
