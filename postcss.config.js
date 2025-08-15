module.exports = {
  plugins: [
    require("tailwindcss"),
    require("postcss-prefixwrap")(".dify-chatbot", {
      // 跳过已经有 .dify-chatbot 前缀的选择器，避免重复包装
      ignoredSelectors: [/^\.dify-chatbot/, /^\.dify-chatbot\.dark/],
    }),
    require("autoprefixer"),
  ],
};
