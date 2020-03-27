const rule = process.env.NODE_ENV === 'development' ? 'off' : 'error';

// https://eslint.org/docs/user-guide/configuring
module.exports = {
  // parser: '@typescript-eslint/parser', //定义ESLint的解析器
  extends: [
    'eslint:recommended',
    '@vue/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/essential'
  ], //定义文件继承的子规范
  plugins: ['@typescript-eslint'], //定义了该eslint文件所依赖的插件
  env: {
    //指定代码的运行环境
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    indent: [2, 2, { "SwitchCase": 1 }],
    // allow async-await
    // allow debugger during development
    'generator-star-spacing': 'off',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    semi: 'off',
    'no-debugger': 'error',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
  }
};
