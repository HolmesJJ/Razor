<script>
import UploadList from "./upload-list";
import ComUpload from "./upload";
import UploadSlot from "./upload-slot";
import Progress from "pkg/progress";
import Migrating from "rz/mixins/migrating";

function noop() {}

export default {
  name: "Upload",

  options: {
    name: "Upload"
  },

  mixins: [Migrating],

  components: {
    Progress,
    UploadList,
    ComUpload,
    UploadSlot
  },

  provide() {
    return {
      uploader: this
    };
  },

  inject: {
    Form: {
      default: ""
    },
    DragUpload: {
      default: ""
    }
  },

  props: {
    action: {
      type: String,
      required: true
    },
    headers: {
      type: Object,
      default() {
        return {};
      }
    },
    data: Object,
    multiple: Boolean,
    name: {
      type: String,
      default: "file"
    },
    drag: Boolean,
    dragger: Boolean,
    withCredentials: Boolean,
    showFileList: {
      type: Boolean,
      default: true
    },
    accept: String,
    type: {
      type: String,
      default: "select"
    },
    beforeUpload: Function,
    beforeRemove: Function,
    onRemove: {
      type: Function,
      default: noop
    },
    onChange: {
      type: Function,
      default: noop
    },
    onPreview: {
      type: Function
    },
    onSuccess: {
      type: Function,
      default: noop
    },
    onProgress: {
      type: Function,
      default: noop
    },
    onError: {
      type: Function,
      default: noop
    },
    fileList: {
      type: Array,
      default() {
        return [];
      }
    },
    autoUpload: {
      type: Boolean,
      default: false // 目前业务上用不到
    },
    listType: {
      type: String,
      default: "text" // text,picture,picture-card
    },
    httpRequest: Function,
    disabled: Boolean,
    limit: Number,
    onExceed: {
      type: Function,
      default: noop
    },
    width:Number,
    height:Number,
  },

  data() {
    return {
      uploadFiles: [],
      dragOver: false,
      draging: false,
      tempIndex: 1
    };
  },

  computed: {
    uploadDisabled() {
      return this.disabled || (this.Form || {}).disabled;
    }
  },

  watch: {
    fileList: {
      immediate: true,
      handler(value) {
        this.uploadFiles = value.map(item => {
          item.uid = item.uid || this.tempIndex++;
          item.status = item.status || "success";
          return item;
        });
      }
    }
  },

  methods: {
    handleStart(rawFile) {
      rawFile.uid = Date.now() + this.tempIndex++;
      let file = {
        status: "ready",
        name: rawFile.name,
        size: rawFile.size,
        percentage: 0,
        uid: rawFile.uid,
        raw: rawFile
      };

      if (this.listType === "picture-card" || this.listType === "picture") {
        try {
          file.url = URL.createObjectURL(rawFile);
        } catch (err) {
          console.error("[Razor Error][Upload]", err);
          return;
        }
      }

      this.uploadFiles.push(file);

      const { onChange: DragUploadChangeHandler } = this.DragUpload;
      DragUploadChangeHandler
        ? DragUploadChangeHandler(file, this.uploadFiles)
        : this.onChange(file, this.uploadFiles);
    },
    handleProgress(ev, rawFile) {
      const file = this.getFile(rawFile);

      const { onProgress: DragUploadProgressHandler } = this.DragUpload;
      DragUploadProgressHandler
        ? DragUploadProgressHandler(ev, file, this.uploadFiles)
        : this.onProgress(ev, file, this.uploadFiles);

      // this.onProgress(ev, file, this.uploadFiles);
      file.status = "uploading";
      file.percentage = ev.percent || 0;
    },
    handleSuccess(res, rawFile) {
      const file = this.getFile(rawFile);

      if (file) {
        file.status = "success";
        file.response = res;
        const {
          onSuccess: DragUploadSuccessHandler,
          onChange: DragUploadChangeHandler
        } = this.DragUpload;

        DragUploadSuccessHandler
          ? DragUploadSuccessHandler(res, file, this.uploadFiles)
          : this.onSuccess(res, file, this.uploadFiles);

        // this.onSuccess(res, file, this.uploadFiles);

        DragUploadChangeHandler
          ? DragUploadChangeHandler(file, this.uploadFiles)
          : this.onChange(file, this.uploadFiles);
        // this.onChange(file, this.uploadFiles);
      }
    },
    handleError(err, rawFile) {
      const file = this.getFile(rawFile);
      const fileList = this.uploadFiles;

      file.status = "fail";

      fileList.splice(fileList.indexOf(file), 1);

      const {
        onError: DragUploadErrorHandler,
        onChange: DragUploadChangeHandler
      } = this.DragUpload;

      DragUploadErrorHandler
        ? DragUploadErrorHandler(err, file, this.uploadFiles)
        : this.onError(err, file, this.uploadFiles);

      // this.onError(err, file, this.uploadFiles);
      DragUploadChangeHandler
        ? DragUploadChangeHandler(file, this.uploadFiles)
        : this.onChange(file, this.uploadFiles);
      // this.onChange(file, this.uploadFiles);
    },
    handleRemove(file, raw) {
      if (raw) {
        file = this.getFile(raw);
      }
      let doRemove = () => {
        this.abort(file);
        let fileList = this.uploadFiles;
        fileList.splice(fileList.indexOf(file), 1);

        const { onRemove: DragUploadRemoveHandler } = this.DragUpload;
        DragUploadRemoveHandler
          ? DragUploadRemoveHandler(file, fileList)
          : this.onRemove(file, fileList);

        // this.onRemove(file, fileList);
      };

      if (!this.beforeRemove) {
        doRemove();
      } else if (typeof this.beforeRemove === "function") {
        const before = this.beforeRemove(file, this.uploadFiles);
        if (before && before.then) {
          before.then(() => {
            doRemove();
          }, noop);
        } else if (before !== false) {
          doRemove();
        }
      }
    },
    getFile(rawFile) {
      let fileList = this.uploadFiles;
      let target;
      fileList.every(item => {
        target = rawFile.uid === item.uid ? item : null;
        return !target;
      });
      return target;
    },
    abort(file) {
      this.$refs["upload-inner"].abort(file);
    },
    clearFiles() {
      this.uploadFiles = [];
    },
    submit() {
      this.uploadFiles
        .filter(file => file.status === "ready")
        .forEach(file => {
          this.$refs["upload-inner"].upload(file.raw);
        });
    },
    getMigratingConfig() {
      return {
        props: {
          "default-file-list": "default-file-list is renamed to file-list.",
          "show-upload-list": "show-upload-list is renamed to show-file-list.",
          "thumbnail-mode":
            "thumbnail-mode has been deprecated, you can implement the same effect according to this case: http://element.eleme.io/#/zh-CN/component/upload#yong-hu-tou-xiang-shang-chuan"
        }
      };
    },

    resumeProps() {
      /* 处理如果是拖拽上传组件作为父级传入props的情况, DragUpload作为provider注入 */
      /* eslint-disable-next-line */
      const getMethods = methodKey => {
        const {
          onExceed: defaultOnExceed,
          onPreview: defaultOnPreview,
          beforeUpload: defaultbBeforeUpload,
          withCredentials: defaultWithCredentials
        } = this;

        let {
          onExceed,
          onPreview,
          beforeUpload,
          withCredentials
        } = this.DragUpload;

        return {
          onExceed: onExceed || defaultOnExceed,
          onPreview: onPreview || defaultOnPreview,
          beforeUpload: beforeUpload || defaultbBeforeUpload,
          withCredential: withCredentials || defaultWithCredentials
        };
      };
      const {
        onExceed,
        onPreview,
        beforeUpload,
        withCredential
      } = getMethods();

      const uploadData = {
        props: {
          type: this.type,
          drag: this.drag,
          action: this.action,
          multiple: this.multiple,
          "before-upload": beforeUpload,
          "with-credentials": withCredential,
          headers: this.headers,
          name: this.name,
          data: this.data,
          accept: this.accept,
          // fileList: this.uploadFiles,
          autoUpload: this.autoUpload,
          listType: this.listType,
          disabled: this.uploadDisabled,
          limit: this.limit,
          "on-exceed": onExceed,
          "on-start": this.handleStart,
          "on-progress": this.handleProgress,
          "on-success": this.handleSuccess,
          "on-error": this.handleError,
          "on-preview": onPreview,
          "on-remove": this.handleRemove,
          "http-request": this.httpRequest
        },
        ref: "upload-inner"
      };
      return uploadData;
    }
  },

  mounted() {
    this.resumeProps();
  },

  beforeDestroy() {
    this.uploadFiles.forEach(file => {
      if (file.url && file.url.indexOf("blob:") === 0) {
        URL.revokeObjectURL(file.url);
      }
    });
  },
  /* eslint-disable-next-line */
  render(h) {
    let uploadList;

    if (this.showFileList) {
      uploadList = (
        <UploadList
          disabled={this.uploadDisabled}
          listType={this.listType}
          files={this.uploadFiles}
          on-remove={this.handleRemove}
          handlePreview={this.onPreview}
        />
      );
    }
    const uploadData = this.resumeProps();
    const large = this.width > 160 // width > 160 change slot style 
    const SlotDefault = <UploadSlot width={this.width} height={this.height} large={large}  disabled={this.uploadDisabled}></UploadSlot>
    const trigger = this.$slots.trigger || this.$slots.default || SlotDefault;
    const uploadComponent = <ComUpload {...uploadData}>{trigger}</ComUpload>;

    return (
      <div>
        {this.listType === "picture-card" ? uploadList : ""}
        {this.$slots.trigger
          ? [uploadComponent, this.$slots.default]
          : uploadComponent}
        {this.$slots.tip}
        {this.listType !== "picture-card" ? uploadList : ""}
      </div>
    );
  }
};
</script>
