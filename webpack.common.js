const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: {
    main: path.join(__dirname, "src", "ft_bundle_main.js"),
  },
  target: "node",
  output: {
    path: path.join(__dirname, "docs"),
    filename: "ft_bundle.js",
    library: "myLib",
    libraryTarget: "umd",
    globalObject: "this",
  },
  externals: [nodeExternals()],
};
