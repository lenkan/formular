const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const serve = require('webpack-serve')

serve({
  config: {
    mode: "development",
    devtool: "inline-source-map",

    entry: path.resolve(__dirname, 'index.tsx'),

    output: {
      filename: 'bundle.js',
    },

    plugins: [
      new HtmlWebpackPlugin({
        title: 'Tjoho'
      })
    ],

    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader"
        }
      ]
    }
  }
})
