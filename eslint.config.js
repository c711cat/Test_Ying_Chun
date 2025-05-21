import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintConfigStandard from '@vue/eslint-config-standard';
import babelParser from '@babel/eslint-parser'; 

export default [
  // 忽略的文件
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/node_modules/**'],
  },

  // 核心 JavaScript 規則
  js.configs.recommended, // 啟用 ESLint 推薦的 JavaScript 規則

  // Vue 相關規則和配置
  {
    // 獨立的配置對象，用於 Vue 檔案
    files: ['**/*.vue'], // 只對 .vue 文件應用這些規則
    languageOptions: {
      parser: vueParser, // 使用 vue-eslint-parser 解析 .vue 文件
      parserOptions: {
        // 需要修正
        parser: babelParser, // 使用 @babel/eslint-parser 解析 Vue 檔案中的 <script> 部分
        ecmaVersion: 2022,
        sourceType: 'module',
        requireConfigFile: false, // 禁用 requireConfigFile 檢查，特別是當沒有 babel.config.js 時
      },
    },
    // 啟用 Vue 推薦的規則
    ...pluginVue.configs['vue3-recommended'], // 使用 'vue3-recommended' 而不是 'flat/essential'，更全面
    rules: {
      // 在這裡針對 Vue 文件添加或覆蓋規則
      'vue/multi-word-component-names': 'off', // 元件名稱是單詞，可以關閉此規則
    },
  },
  // JavaScript/Vue 文件的通用規則和風格
  {
    files: ['**/*.{js,mjs,cjs,vue}'], // 定義 ESLint 要檢查的文件類型
    rules: {
      // 覆蓋或添加 ESLint 規則，會應用於所有指定的文件類型
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      // Standard 風格相關的覆蓋或調整
      'semi': ['error', 'never'], // 禁用分號 (與 Prettier 和 Standard 風格保持一致)
      'indent': ['error', 2, { 'SwitchCase': 1 }], // 縮進為 2 個空格 (與 Prettier 和 Standard 風格保持一致)
      'quotes': ['error', 'single'], // 使用單引號 (與 Prettier 和 Standard 風格保持一致)
      // Standard 風格的特定規則
      'space-before-function-paren': ['error', 'always'],
    },
  },
  // Standard JS 風格配置 (放在 Prettier 之前) 應用 Standard 的規則集，但會被 Prettier 禁用掉格式化相關的規則
  eslintConfigStandard,

  // Prettier 兼容性配置 (放在最後) 它會禁用所有與 Prettier 衝突的 ESLint 格式化規則，確保 Prettier 接管格式化
  eslintConfigPrettier,
];