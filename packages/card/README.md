### Card 卡片

<script>
export default {
  data(){
    return {
      list:[
        {msg:'1', activated: true, id: 1},
        {msg:'2', activated: false, id: 2},
      ]
    }
  },
  methods:{
    handleClick(item){
      this.list = this.list.map((card)=> {
        card.activated = item.id === card.id;
        return card;
      })
    }
  }
}
</script>
<style lang="scss" scoped>
*{
  padding: 0;
  margin: 0;
}

.demo-card {
  height: 256px;
  width: 216px;
  margin-left: 8px;
  .rz-checkbox{
    margin-right: 0;
  }
}
.demo-card-header{
  /* border-bottom:1px solid rgba(#56668d, .3);; */
  padding-left: 8px;
  line-height: 32px;
}
.demo-card ul li{
  list-style: none;
  line-height: 32px;
  margin: 8px 0; 
  padding: 0 8px; 
}
.demo-card ul li:hover{
  background: rgba(#56668d, .3);
}

.demo-card ul li span{
  padding: 0 4px;
  display: inline-block;
  line-height: inherit;
}
</style>
:::demo
```html
<template>
  <div style="display: flex;">
    <rz-card v-for="item,index in list" :key="index" :activated="item.activated" class="demo-card" @click="handleClick(item)">
      <div class="demo-card-header">
        | Todo List
      </div>
      <ul>
        <li><rz-checkbox></rz-checkbox><span>&nbsp;&nbsp;1. 出去买十个馒头</span></li>
        <li><rz-checkbox></rz-checkbox><span>&nbsp;&nbsp;2. 看到卖西瓜的就买一个</span></li>
        <li><rz-checkbox></rz-checkbox><span>&nbsp;&nbsp;3. 回来吃馒头</span></li>
      </ul>
    </rz-card>
  </div>
</template>
<script>
export default {
  data(){
    return {
      list:[
        {msg:'1', activated: true, id: 1},
        {msg:'2', activated: false, id: 2},
      ]
    }
  },
  methods:{
    handleClick(item){
      this.list = this.list.map((card)=> {
        card.activated = item.id === card.id;
        return card;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
*{
  padding: 0;
  margin: 0;
}
.demo-card {
  height: 256px;
  width: 216px;
  margin-left: 8px;
}
.demo-card-header{
  padding-left: 8px;
  line-height: 32px;
}
.demo-card ul li{
  list-style: none;
  line-height: 32px;
  margin: 8px 0; 
  padding: 0 8px; 
}
.demo-card ul li:hover{
  background: rgba(#56668d, .3);
}

.demo-card ul li span{
  padding: 0 4px;
  display: inline-block;
  line-height: inherit;
}
</style>
```
:::

### Card Attributes
| 参数               | 说明                                  | 类型    | 可选值             | 默认值 |
| ------------------ | ------------------------------------- | ------- | ------------------ | ------ |
| activated             | activated 状态                          | boolean  | —               | false |