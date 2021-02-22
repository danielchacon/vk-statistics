const path = require("path");
const webpack = require("webpack");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");

const paths = {
  src: path.resolve(__dirname, "src"),
  build: path.resolve(__dirname, "build"),
};

module.exports = {
  entry: {
    app: "./index.js",
  },
  output: {
    path: paths.build,
    filename: "[name].js",
  },
  mode: process.env.NODE_ENV,
  target: "web",
  optimization: {
    minimize: process.env.NODE_ENV !== "development",
    minimizer: [
      new TerserJSPlugin({
        parallel: true,
      }),
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/].*\.js$/,
          chunks: "initial",
          enforce: true,
          name(_module, _chunks, cacheGroupKey) {
            return `${cacheGroupKey}`;
          },
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": paths.src,
    },
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: "html-loader",
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "cache-loader",
          },
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          process.env.NODE_ENV === "development"
            ? {
                loader: "style-loader",
              }
            : {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: "../",
                },
              },
          "css-loader",
          "fast-sass-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "./css/[name].css",
      chunkFilename: "[name].css",
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Index",
      template: "./index.html",
      filename: "index.html",
    }),
  ],
  devServer: {
    openPage: "index.html",
    historyApiFallback: true,
    open: true,
    compress: true,
    port: 8080,
    hot: true,
    overlay: {
      errors: false,
      warnings: false,
    },
  },
};
