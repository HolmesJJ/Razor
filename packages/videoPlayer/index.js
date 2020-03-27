import VideoPlayer from './src/index.vue';

/* istanbul ignore next */
VideoPlayer.install = function(Vue) {
  Vue.component('Rz' + VideoPlayer.options.name, VideoPlayer);
};

export default VideoPlayer;

