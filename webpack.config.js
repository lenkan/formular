const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: "development",
  devtool: "inline-source-map",

  entry: "./demo/index.tsx",

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Forms'
    })
  ],

  output: {
    filename: 'bundle.js'
  },
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
};