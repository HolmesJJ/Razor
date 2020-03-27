<template>
  <div class="logo">
    <img :src="logoPath" alt>
  </div>
</template>

<script>
import logoPath from "../assets/images/logo.png";

export default {
  name: "Skin",
  data() {
    return {
      logoPath
    };
  },
  mounted() {}
};
</script>

<style scope>
@keyframes logoKeyFrame {
  0% {
    display: block;
    background: rgba(0, 0, 0, 0.5);
  }
  20% {
    display: block;
    background: rgba(0, 0, 0, 0.4);
  }
  40% {
    display: block;
    background: rgba(0, 0, 0, 0.3);
  }
  80% {
    display: block;
    background: rgba(0, 0, 0, 0.15);
  }
  100% {
    display: none;
    background: rgba(0, 0, 0, 0.05);
  }
}

@keyframes imgKeyFrame {
  0% {
    left: -50%;
    top: 150%;
    width: 768px;
    height: 768px;
  }
  20% {
    left: -10%;
    top: 110%;
    width: 640px;
    height: 640px;
  }
  40% {
    left: 30%;
    top: 70%;
    width: 512px;
    height: 512px;
  }
  60% {
    left: 70%;
    top: 30%;
    width: 384px;
    height: 384px;
  }
  80% {
    left: 110%;
    top: -10%;
    width: 256px;
    height: 256px;
  }
  100% {
    left: 150%;
    top: -50%;
    width: 128px;
    height: 128px;
    display: none;
  }
}
.logo {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  /* 这里要比header大 */
  z-index: 10000;
  animation: logoKeyFrame 2.6s linear 1 forwards;
}
.logo > img {
  position: absolute;
  width: 768px;
  height: 768px;
  transform: translate(-50%, -50%);
  animation: imgKeyFrame 2.8s linear 1 forwards;
}
</style>
