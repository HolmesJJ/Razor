### Close

<script>
export default {
  methods:{
    handleClose(event){
      console.log(event)
    }
  }
}
</script>
:::demo
```html
<template>
  <div style="position:relative; width: 176px; height: 176px; background: #56668d; border-radius:5px;">
    <rz-close></rz-close>
  </div>
</template>
<script>
export default {
  methods:{
    handleClose(event){
      console.log(event)
    }
  }
}
</script>
```
:::