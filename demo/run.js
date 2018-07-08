const HtmlWebpackPlugin = require('html-webpack-plugin')
const fs = require('fs')
const path = require('path')
const generate = require('./generate')
const serve = require('webpack-serve')


serve({
  on: {
    "build-started": args => {
      const contents = generate()
      fs.writeFileSync(path.resolve(__dirname, 'forms', 'index.ts'), contents)
    }
  },

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
      extensions: [".ts", ".tsx", ".js", ".jsx", ".less"]
    },
    module: {
      rules: [
        {
          test: /\.less$/,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader'
            },
            {
              loader: 'less-loader'
            }
          ]
        },
        {
          test: /\.tsx?$/,
          loader: "ts-loader"
        }
      ]
    }
  }
})
