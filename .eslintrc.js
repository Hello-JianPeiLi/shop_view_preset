module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/standard'],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaFeatures: {
      globalReturn: true
    }
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 禁用函数括号前的空格校验
    'space-before-function-paren': 0,
    'no-useless-return': 0
    // "indent": ['error', 2],
    // "semi": 'off'
  }
}
