export default {
  data() {
    return {
      showHeader: true
    }
  },
  watch: {
    "$route.path": {
      handler() {
        this.showHeader = this.$route.query.hideHeader !== 'true';
      }
    }
  },
  created() {
    this.showHeader = this.$route.query.hideHeader !== 'true';
  },
}