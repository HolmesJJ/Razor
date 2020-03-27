import { t } from 'rz/locale';

export default {
  methods: {
    t(...args) {
      return t.apply(this, args);
    }
  }
};
