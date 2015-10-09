var path = require('path');

console.log(path.join(__dirname, './assets/'));
module.exports = {
  entry: [
    './client',
  ],
  resolve: {
    modulesDirectories: ['node_modules', 'client'],
    extensions: ['', '.js', '.jsx'],
  },
  output: {
    path: path.join(__dirname, './assets/'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel']
      }
    ]
  },
};


