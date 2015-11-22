const webpack = require('webpack')

module.exports = {
  entry: './src/app.tsx',
  output: {
    filename: 'dist/bundle.js'
  },
  // Turn on sourcemaps
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  // Add minification
  plugins: [
    //new webpack.optimize.UglifyJsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.(ts|tsx)$/, loaders: [
          'imports?define=>false',
          'ts'
        ]
      }
    ]
  },
  /*ts: {
    transpileOnly: true
  }*/
}