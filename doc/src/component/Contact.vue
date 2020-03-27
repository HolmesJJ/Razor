<template>
  <ul class="contact-list">
    <li>&nbsp;&nbsp;&nbsp;&nbsp;SCG-IVA-BP Web前端组件库 Razor</li>
    <li>&nbsp;&nbsp;&nbsp;&nbsp;|</li>
    <li>&nbsp;&nbsp;&nbsp;&nbsp;联系邮箱: &nbsp;&nbsp;{{Email}}</li>
  </ul>
</template>
<script>
export default {
  data() {
    return {
      Email: "iva.razor.support@sensetime.com"
    };
  }
};
</script>

<style lang="scss" scoped>
.contact-list {
  margin: 0;
  padding: 0 0 0 20px;
  list-style: none;
  position: fixed;
  right: 0;
  bottom: 0;
  line-height: 28px;
  flex-wrap: wrap;
  width: 100vw;
  background: rgba(255, 255, 255, 0.3);
  font-size: 14px;
  border-top: 1px solid rgba(133, 133, 133, 0.3);
  font-weight: bold;
  display: flex;
}
</style>

