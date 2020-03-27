
import { use } from 'rz/locale';
import zhLocale from 'rz/locale/lang/zh-CN';
import zhTWLocale from 'rz/locale/lang/zh-TW';
import enLocale from 'rz/locale/lang/en';
import esLocale from 'rz/locale/lang/es';

// const lang = 'zh-TW';

export const localize = lang => {
  switch (lang) {
  case 'zh-CN':
    use(zhLocale);
    break;
  case 'es':
    use(esLocale);
    break;
  case 'fr-FR':
    use(frLocale);
    break;
  case 'zh-TW':
    use(zhTWLocale);
    break;
  default:
    use(enLocale);
  }
};

