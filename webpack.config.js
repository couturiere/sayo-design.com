const path = require("path")

module.exports = {
  context: path.join(__dirname, "src"),
  entry: "./js/redirect.js",
  output: {
    path: path.join(__dirname, "docs", "js"),
    filename: "redirect.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel"
      }
    ]
  }
}
