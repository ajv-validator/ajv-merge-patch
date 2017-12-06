const path = require('path');

module.exports = {
  entry:     './index.webpack.js',
  devtool:   'source-map',
  module:    {
    rules: [
      {
        test:   /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  externals: Object.keys(require('./package').dependencies),
  output:    {
    libraryTarget: 'commonjs2',
    path:          path.resolve(__dirname, 'dist'),
    filename:      'bundle.js'
  },
  target:    'node'
};
