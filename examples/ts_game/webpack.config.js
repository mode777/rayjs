const path = require('path');

module.exports = {
  entry: {
    main: './src/index.ts',
    editor: './src/editor.ts',
    experiments: './src/experiments.ts',
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
