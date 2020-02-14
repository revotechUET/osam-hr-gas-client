const path = require('path');
const GasPlugin = require("gas-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          warnings: false,
          mangle: false,
          compress: {
            drop_console: false,
            drop_debugger: isProduction
          },
          output: {
            beautify: !isProduction
          }
        }
      })
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new GasPlugin(),
  ],
  mode: isProduction ? 'production' : 'none',
};
