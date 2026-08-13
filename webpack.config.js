const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/main.js',
    output: {
      filename: 'bundle.[contenthash].js',
      path: path.resolve(__dirname, 'build'),
      clean: true,
      publicPath: isProduction ? './' : '/',
    },
    devtool: 'source-map',
    plugins: [
      new HtmlPlugin({
        template: 'public/index.html',
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'public',
            globOptions: {
              ignore: ['**/index.html'],
            },
          },
        ],
      }),
      new Dotenv({
        path: '.env',
        safe: true,
        systemvars: true,
      }),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            },
          },
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        },
      ],
    },
  }
};
