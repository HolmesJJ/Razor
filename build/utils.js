const path = require('path')
const resolve = (dir = '.', context = path.join(__dirname, '..')) =>
  path.join(context, dir)
exports.resolve = resolve;

/** @param {string} _path */
exports.assetsPath = (_path) => {
  const assetsSubDirectory = './'
  // process.env.NODE_ENV === 'production' ? './' : '/'

  return path.posix.join(assetsSubDirectory, _path)
}

exports.replaceLoader = (() => {
  /**
   * @param {Module} modu
   * @param {(value: RuleSetRule) => RuleSetRule} callbackfn
   * @returns {Module}
   */
  const mapRule = (modu, callbackfn) => {
    /** @type {Partial<Module>} */
    const mapped = {};

    if (Array.isArray(modu.preLoaders)) {
      mapped.preLoaders = modu.preLoaders.map(rule => callbackfn(rule));
    }

    if (Array.isArray(modu.postLoaders)) {
      mapped.postLoaders = modu.postLoaders.map(rule => callbackfn(rule));
    }

    mapped.rules = modu.rules.map(rule => callbackfn(rule));

    return { ...modu, ...mapped };
  }

  /**
   * @param {RuleSetRule} rule
   * @param {(value: RuleSetUse) => RuleSetUse} callbackfn
   * @returns {RuleSetRule}
   */
  const mapUse = (rule, callbackfn) => {
    /** @type {Partial<RuleSetRule>} */
    const mapped = {};

    if (Array.isArray(rule.oneOf)) {
      mapped.oneOf = rule.oneOf.map(rule => mapUse(rule, callbackfn));
    }

    if (Array.isArray(rule.rules)) {
      mapped.rules = rule.rules.map(rule => mapUse(rule, callbackfn));
    }

    if (undefined !== rule.loader) {
      mapped.loader = callbackfn(rule.loader);
    }

    if (undefined !== rule.loaders) {
      mapped.loaders = callbackfn(rule.loaders);
    }

    if (undefined !== rule.use) {
      mapped.use = callbackfn(rule.use);
    }

    return { ...rule, ...mapped };
  }

  /**
   * @param {RuleSetUse} use
   * @param {(value: NonFunctionalRuleSetUseItem) => NonFunctionalRuleSetUseItem} callbackfn
   * @returns {RuleSetUse}
   */
  const mapUseItem = (use, callbackfn) => {
    if (typeof use === "function") {
      return /** @return {NonFunctionalRuleSetUseItem|RuleSetUseItem[]} */ function (...args) {
        /** @type {Exclude<RuleSetUse, Function>} */
        const item = use.apply(this, args);

        if (Array.isArray(item)) {
          return item.map(item => extractItem(item, callbackfn));
        } else {
          return callbackfn(item);
        }
      };
    } else if (Array.isArray(use)) {
      return use.map(item => extractItem(item, callbackfn));
    } else {
      return callbackfn(use);
    }
  }

  /**
   * @param {RuleSetUseItem} item
   * @param {(value: NonFunctionalRuleSetUseItem) => NonFunctionalRuleSetUseItem} callbackfn
   * @returns {RuleSetUseItem}
   */
  const extractItem = (item, callbackfn) => {
    if (typeof item === "function") {
      return function (...args) {
        return callbackfn(item.apply(this, args));
      }
    } else {
      return callbackfn(item);
    }
  }

  /**
   * 替换 style-loader 为 MiniCssExtractPlugin
   * @param {Configuration} config
   * @param {NonFunctionalRuleSetUseItem} from
   * @param {NonFunctionalRuleSetUseItem} to
   * @returns {Configuration}
   */
  const returns = (config, from, to) => ({
    ...config,
    module: mapRule(config.module, rule =>
      mapUse(rule, use =>
        mapUseItem(use, item => {
          // FIXME: 只能替换字符串
          return item === from ? to : item;
        })))
  });

  return returns;
})();

exports.alias = {
  rz: resolve('src'),
  pkg: resolve('packages'),
  doc: resolve('doc/src')
}

/**
 * @typedef {import('webpack').Module} Module
 * @typedef {import('webpack').RuleSetRule} RuleSetRule
 * @typedef {import('webpack').RuleSetUse} RuleSetUse
 * @typedef {import('webpack').RuleSetUseItem} RuleSetUseItem
 * @typedef {Exclude<RuleSetUseItem, Function>} NonFunctionalRuleSetUseItem
 * @typedef {import('webpack').RuleSetLoader} RuleSetLoader
 * @typedef {import('webpack').Configuration} Configuration
 */
