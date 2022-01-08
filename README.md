> # node.ft

> ### 目的
* [ここ](https://qiita.com/bellbind/items/ba7aa07f6c915d400000)を丸パクリ😅
  * 自分用にフーリエ変換をライブラリー化
* node.jsでもhtmlでも使えるように、webpackでモジュールバンドルを図ってみた
  | ファイル名   | 出力先 | lib名 | class名 | 公開API | 役割               |
  | ------------ | ------ | ----- | ------- | ------- | ------------------ |
  | ft_bundle.js | docs   | myLib | dft     | convert | 離散フーリエ変換   |
  |              |        |       |         | revert  | 逆離散フーリエ変換 |
  |              |        |       | fft     | convert | 高速フーリエ変換   |
  |              |        |       |         | revert  | 逆高速フーリエ変換 |
  |              |        |       | util    | expi    | オイラーの公式より |
  |              |        |       |         | iadd    | 複素数の足し算     |
  |              |        |       |         | isub    | 複素数の引き算     |
  |              |        |       |         | imul    | 複素数の掛け算     |
  |              |        |       |         | isum    | 複素数配列の総和   |
  |              |        |       |         | round   | 独自の丸め処理     |

> ### 下準備

* 追加モジュール
  ```
  npm i -D webpack webpack-cli webpack-merge webpack-node-externals
  ```

* ```package.json```
  ```
  "scripts": {
    "build": "webpack --config webpack.prod.js",
    "start": "node index.js"
  },
  ```

* ```webpack.common.js```
  ```
  const path = require("path");
  const nodeExternals = require("webpack-node-externals");

  module.exports = {
    entry: {
      main: path.join(__dirname, "src", "main.js"),
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
  ```

* ```webpack.prod.js```

  ```
  const { merge } = require("webpack-merge");
  const path = require("path");
  const common = require("./webpack.common.js");

  module.exports = merge(common, {
    mode: "production",
    devtool: "source-map",
  });
  ```

> ### サンプルソース（for node.js）

* ```index.js```
  ```
  const myLib = require("./docs/ft_bundle.js");
  {
    console.log("***** dft demo *****");
    // 15 elements example
    const fr0 = [1.5, 3.4, 4.2, 2.0, 5.0, 6.0, 2.5, 4.4, 0.2, 1.0, 3.0, 4.0, 5.5, 62.4, 2.2];
    const f0 = fr0.map((r) => [r, 0]);
    const F = myLib.dft.convert(f0);
    const f1 = myLib.dft.revert(F);
    const fr1 = f1.map(([r]) => r);

    console.log("fr0:", fr0);
    console.log("F:", F);
    // console.log("f1:", f1);
    console.log(
      "fr1:",
      fr1.map((r) => myLib.ftLib.round(r, 3))
    );
  }
  {
    console.log("***** fft demo *****");
    // 15 elements example
    const fr0 = [1.5, 3.4, 4.2, 2.0, 5.0, 6.0, 2.5, 4.4, 0.2, 1.0, 3.0, 4.0, 5.5, 62.4, 2.2];
    const f0 = fr0.map((r) => [r, 0]);
    const F = myLib.fft.convert(f0);
    const f1 = myLib.fft.revert(F);
    const fr1 = f1.map(([r]) => r);

    console.log("fr0:", fr0);
    console.log("F:", F);
    // console.log("f1:", f1);
    console.log(
      "fr1:",
      fr1.map((r) => myLib.ftLib.round(r, 3))
    );
  }
  ```

> ### サンプルソース（for web browser）

* ```index.html```
  ```
  <!DOCTYPE html>
  <html>

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>SAMPLE</title>
    <link rel=”shortcut icon” href=”./favicon.ico” />
    <script src='./ft_bundle.js'></script>
  </head>

  <body>
    <button onclick="demo();">GO!</button>
  </body>

  <script>
  function demo() {
    {
      console.log("***** dft demo *****");
      // 15 elements example
      const fr0 = [1.5, 3.4, 4.2, 2.0, 5.0, 6.0, 2.5, 4.4, 0.2, 1.0, 3.0, 4.0, 5.5, 62.4, 2.2];
      const f0 = fr0.map((r) => [r, 0]);
      const F = myLib.dft.convert(f0);
      const f1 = myLib.dft.revert(F);
      const fr1 = f1.map(([r]) => r);

      console.log("fr0:", fr0);
      console.log("F:", F);
      // console.log("f1:", f1);
      console.log(
        "fr1:",
        fr1.map((r) => myLib.ftLib.round(r, 3))
      );
    }
    {
      console.log("***** fft demo *****");
      // 15 elements example
      const fr0 = [1.5, 3.4, 4.2, 2.0, 5.0, 6.0, 2.5, 4.4, 0.2, 1.0, 3.0, 4.0, 5.5, 62.4, 2.2];
      const f0 = fr0.map((r) => [r, 0]);
      const F = myLib.fft.convert(f0);
      const f1 = myLib.fft.revert(F);
      const fr1 = f1.map(([r]) => r);

      console.log("fr0:", fr0);
      console.log("F:", F);
      // console.log("f1:", f1);
      console.log(
        "fr1:",
        fr1.map((r) => myLib.ftLib.round(r, 3))
      );
    }
  }
  </script>

  </html>
  ```

> ### サンプルソースの解説
1. 整数配列（fr0）を複素数配列（f0）へ変換
2. 複素数配列（f0）をフーリエ変換（myLib.[ dft | fft ].convert(f0)）→（F）
3. フーリエ変換値配列（F）を逆フーリエ変換（myLib.[ dft | fft ].revert(F)）→（f1）
4. 逆フーリエ変換値配列（f1）から整数配列（fr1）へ変換
