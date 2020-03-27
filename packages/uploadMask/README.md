### UploadMask
<script>
  export default {
    data(){
      return{
        imgList:[],
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
      }
    },

    created(){
      this.makeList();
    },
  }
</script>
:::demo
```html
  <rz-upload-mask :imageList="imgList">
        123123
  </rz-upload-ask>
```
:::