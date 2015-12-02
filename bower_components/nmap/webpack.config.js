'use strict';
var webpack = require('webpack');
var path = require('path');
module.exports = {
  entry: {
    app: ['./js/app.js']
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins:[
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};