'use strict';
var webpack = require('webpack');
var path = require('path');
module.exports = {
  entry: {
    app: ['./js/src/index.prod.js']
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: 'nmap.dist.js'
  },
  plugins:[
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};