### DashedCircle
<script>
export default {
  data(){
    return {
      circles:[]
    }
  },
  mounted() {
    this.circles = [
      {
        id: 1,
        data:[]
      }
    ]
  }
}
</script>
:::demo
```html
<template>
  <rz-dashed-circle :circles="circles"></rz-dashed-circle>
</template>
```
:::