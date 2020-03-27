<template>
  <transition-group
    tag="ul"
    :class="[
      'rz-upload-list',
      'rz-upload-list--' + listType,
      { 'is-disabled': disabled }
    ]"
    name="rz-list"
  >
    <li
      v-for="(file) in files"
      :class="['rz-upload-list__item', 'is-' + file.status, focusing ? 'focusing' : '']"
      :key="file.name"
      tabindex="0"
      @keydown.delete="!disabled && $emit('remove', file)"
      @focus="focusing = true"
      @blur="focusing = false"
      @click="focusing = false"
    >
      <rz-image-close
        class="rz-upload-list__item-thumbnail"
        @close="$emit('remove', file)"
        width="96"
        height="120"
        v-if="file.status !== 'uploading' && ['picture-card', 'picture'].indexOf(listType) > -1"
        :src="file.url" alt=""
      />
      <a class="rz-upload-list__item-name" @click="handleClick(file)">
        <i class="rz-icon-document"></i>{{file.name}}
      </a>
      <label class="rz-upload-list__item-status-label">
        <i :class="{
          'rz-icon-upload-success': true,
          'rz-icon-circle-check': listType === 'text',
          'rz-icon-check': ['picture-card', 'picture'].indexOf(listType) > -1
        }"></i>
      </label>
      <!-- <i class="rz-icon-close" v-if="!disabled" @click="$emit('remove', file)"></i> -->
      <i class="rz-icon-close-tip" v-if="!disabled">{{ t('el.upload.deleteTip') }}</i> <!--因为close按钮只在li:focus的时候 display, li blur后就不存在了，所以键盘导航时永远无法 focus到 close按钮上-->
      <rz-progress
        v-if="file.status === 'uploading'"
        :type="listType === 'picture-card' ? 'circle' : 'line'"
        :stroke-width="listType === 'picture-card' ? 6 : 2"
        :percentage="parsePercentage(file.percentage)">
      </rz-progress>
      <!-- <span class="rz-upload-list__item-actions" v-if="listType === 'picture-card'">
        <span
          class="rz-upload-list__item-preview"
          v-if="handlePreview && listType === 'picture-card'"
          @click="handlePreview(file)"
        >
          <i class="rz-icon-zoom-in"></i>
        </span>
        <span
          v-if="!disabled"
          class="rz-upload-list__item-delete"
          @click="$emit('remove', file)"
        >
          <i class="rz-icon-delete"></i>
        </span>
      </span> -->
    </li>
  </transition-group>
</template>
<script>
import Locale from 'rz/mixins/locale';
import RzProgress from 'pkg/progress';

export default {
  mixins: [Locale],
    

  data() {
    return {
      focusing: false
    };
  },
  components: { RzProgress },

  props: {
    files: {
      type: Array,
      default() {
        return [];
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    handlePreview: Function,
    listType: String
  },
  methods: {
    parsePercentage(val) {
      return parseInt(val, 10);
    },
    handleClick(file) {
      this.handlePreview && this.handlePreview(file);
    }
  }
};
</script>
