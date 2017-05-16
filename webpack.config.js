module.exports = {
  entry: "./frontend/src/javascripts/app.js",
  output: {
    path: __dirname + "/app/assets/javascripts/component",
    filename: "app.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
}
