const { merge } = require("webpack-merge");
const path = require("path");
const common = require("./webpack.common.js");

// common設定とマージする
module.exports = merge(common, {
  mode: "development", // 開発モード
  devtool: "inline-source-map", // 開発用ソースマップ
  devServer: {
    contentBase: path.join(__dirname, "docs"),
  },
});
