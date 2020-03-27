<template>
  <div class="rz-dragUpload" :class="className">
    <rz-dialog top="0" :showHeader="false" :visible="_showModel">
      <div slot="header" style="display:none"></div>
      <rz-upload v-if="_showModel" drag :action="action" :autoUpload="autoUpload" :limit="limit" :on-exceed="onExceed" :multiple="multiple" ref='rz_upload'>
        <div slot="trigger">
          <slot v-if="!!$slots.display && _showModel" name="display"></slot>
          <rz-upload-mask v-if="!$slots.display && _showModel" :imageList="maskImageList">
            <p>{{t('el.dragUpload.word')}}</p>
          </rz-upload-mask>
        </div>
      </rz-upload>
    </rz-dialog>
  </div>
</template>


<script lang="ts">

import { Vue, Component, Prop, Provide } from "vue-property-decorator";
import RzUpload from "pkg/upload";
import RzDialog from "pkg/dialog";
import RzUploadMask from "pkg/uploadMask";
import Locale from "rz/mixins/locale";

@Component({
  name: "DragUpload",
  props: {
    ...RzUpload.props,
    action: {
      type: String,
      default: ""
    }
  },
  components: {
    RzUpload,
    RzDialog,
    RzUploadMask
  },
  mixins: [Locale],
})
export default class DragUpload extends Vue {
  @Prop({ type: Boolean, default: false })
  readonly showModel: boolean;

  @Prop({
    type: Array,
    default() {
      return [];
    }
  })
  readonly maskImageList: string[];

  readonly action: string;

  dialogVisible: boolean = false;

  get _showModel() {
    return this.showModel || this.dialogVisible;
  }

  get className() {
    return {
      "is-showModel": this._showModel
    };
  }

  @Provide("DragUpload")
  DragUpload: any = this;

  addGlobalDragEvents() {
    document.body.addEventListener("dragenter", this.dragEnter, false);
    document.body.addEventListener("dragleave", this.dragLeave, false);
    document.body.addEventListener("dragover", this.dragOver, false);
    document.body.addEventListener("drop", this.drop, false);
  }

  removeGlobalDragEvents() {
    document.body.removeEventListener("dragenter", this.dragEnter, false);
    document.body.removeEventListener("dragleave", this.dragLeave, false);
    document.body.removeEventListener("dragover", this.dragOver, false);
    document.body.removeEventListener("drop", this.drop, false);
  }

  dragEnter(ev) {
    if(ev.dataTransfer && ev.dataTransfer.types && ev.dataTransfer.types[0] === 'Files'){
      this.swallowEvent(ev);
      this.triggerDialog(true);
    }
  }

  dragOver(ev) {
    ev.preventDefault();
  }

  drop(ev) {
    this.swallowEvent(ev);
    this.triggerDialog(false);
  }

  swallowEvent(ev) {
    ev.stopPropagation();
    ev.preventDefault();
  }

  dragLeave(ev) {
    this.swallowEvent(ev);
    if (
      ev.pageY <= 0 ||
      ev.pageY >= document.body.clientHeight ||
      ev.pageX <= 0 ||
      ev.pageX >= document.body.clientWidth
    ) {
      this.triggerDialog(false);
    }
  }

  triggerDialog(state) {
    this.$nextTick(() => {
      this.dialogVisible = state;
      this.$emit("visibleChange", this.dialogVisible);
    });
  }
  clearFiles() {
    (this.$refs.rz_upload as any).clearFiles();
  }

  mounted() {
    this.addGlobalDragEvents();
  }

  beforeDestroy() {
    this.removeGlobalDragEvents();
  }
}
</script>
