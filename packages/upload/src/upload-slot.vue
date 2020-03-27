<template>
  <div class="rz-upload-slot" :class="className" :style="containerStyle">
    <slot>
      <div v-show="!disabled" class="rz-upload-slot__center" :class="{'is-large': large}">
        <span :class="{'is-large': large}" class="rz-upload-slot__center--border"></span>
        <span :class="{'is-large': large}" class="rz-upload-slot__center--border"></span>
        <span :class="{'is-large': large}" class="rz-upload-slot__center--border"></span>
        <span :class="{'is-large': large}" class="rz-upload-slot__center--border"></span>
      </div>
      <rz-icon v-show="!disabled" :class="{
        'is-large': large
      }" name="plus"></rz-icon>

      <div v-show="disabled" :class="{'is-large': large}" class="rz-upload-slot__disabled">
        <span></span>
      </div>
    </slot>
  </div>
</template>
<script>

export default {

  data() {
    return {
      focusing: false
    };
  },
  components: { },

  props: {
    width:{
      type:Number,
      default: 96,
    },
    height:{
      type:Number,
      default: 120,
    },
    disabled:{
      type: Boolean,
      default: false
    },
    large: {
      type: Boolean,
      default:false,
    }
  },
  computed:{
    containerStyle(){
      return {
        width:this.width + 'px',
        height:this.height + 'px',
      }
    },
    className(){
      return {
        'is-disable': this.disabled,
      }
    }
  },
  methods: {
    
  }
};
</script>
