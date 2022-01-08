const { merge } = require("webpack-merge");
const path = require("path");
const common = require("./webpack.common.js");

// common設定とマージする
module.exports = merge(common, {
  mode: "production", // 本番モード
  devtool: "source-map", // 開発用ソースマップ
});
