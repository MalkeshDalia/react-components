import path from 'path';
import webpack from 'webpack';
import CompressionPlugin from 'compression-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import webpackBase from './webpack.base.babel';
import assign from 'lodash/assign';
import fs from 'fs';

const paths = {
  SRC: path.resolve(__dirname),
  DIST: path.resolve(__dirname, './build')
};

module.exports = assign({}, webpackBase, {

  entry: `${paths.SRC}/app.js`,

  output: {
    path: paths.DIST,
    filename: 'app.[hash].js'
  },

  plugins: webpackBase.plugins.concat([
    new StyleLintPlugin({
      files: '**/*.scss',
      failOnError: true,
      syntax: 'scss'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true
      }
    }),
    new CompressionPlugin({
      regExp: /\.js$|\.css$/
    }),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: 'showroom/index.html',
      inject: false,
      gzip: '',
      buildPath: 'https://cdn.rawgit.com/buildo/react-components/master/showroom/build/'
    }),
    new ExtractTextPlugin('style', 'style.[hash].min.css')
  ]),

  module: assign({}, webpackBase.module, {
    loaders: webpackBase.module.loaders.concat([
      // style!css loaders
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css')
      },
      // SASS
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap!sass?sourceMap')
      }
    ])
  })

});
