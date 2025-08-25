const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/** @type {import('webpack').Configuration} */
module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    entry: path.resolve(__dirname, 'src/index.tsx'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProd ? 'js/[name].[contenthash].js' : 'js/[name].js',
      chunkFilename: isProd ? 'js/[name].[contenthash].chunk.js' : 'js/[name].chunk.js',
      clean: true,
      publicPath: isProd ? './' : '/',
    },
    devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map',
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          enforce: 'pre',
          test: /\.(js|jsx|ts|tsx)$/,
          loader: 'source-map-loader',
        },
        {
          test: /\.s?css$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: { auto: true, namedExport: false },
                esModule: true,
                sourceMap: !isProd,
              },
            },
            { loader: 'sass-loader', options: { sourceMap: !isProd } },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i,
          type: 'asset',
          parser: { dataUrlCondition: { maxSize: 8 * 1024 } },
          generator: { filename: 'images/[name][hash][ext]' },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public/index.html'),
      }),
      new MiniCssExtractPlugin({ filename: isProd ? 'css/[name].[contenthash].css' : 'css/[name].css' }),
    ],
    devServer: {
      static: path.resolve(__dirname, 'dist'),
      historyApiFallback: true,
      hot: true,
      port: 5173,
      open: false,
    },
    performance: { hints: false },
    stats: 'minimal',
  };
};


