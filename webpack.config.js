module.exports = {
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  entry: {
    app: './_site/static/js/entry.js'
  },
  output: {
    filename: './_site/static/js/bundle.js'
  }
}
