const path = require('path');

module.exports = {
  entry: {
    main: './src/index.ts'
  },
  devtool: false,
  target: "node",
  mode: 'production',
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
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '.'),
  },
};
