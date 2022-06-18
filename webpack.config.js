const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const plugins = [
		new MiniCssExtractPlugin({
			filename: "[name].[contenthash].css"
		}),
		new HtmlWebpackPlugin({
			template: "./pug/pages/index.pug"
		}),
	];

let mode = "development";

if (process.env.NODE_ENV === "production") {
	mode = "production"
}

module.exports = {
	context: path.resolve(__dirname, "src"),
	mode: mode,
	plugins: plugins,
	entry: "./index.js",
	devtool: "source-map",
	resolve: {
		alias: {
			"": path.resolve(__dirname, "src/assets/")
		}
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].[contenthash].js",
		// assetModuleFilename: "assets/[hash][ext][query]",
		clean: true
	},
	devServer: {
		hot: true,
	},
	optimization: {
		splitChunks: {
			chunks: "all",
		},
	},
	devServer: {
		port: 8080
	},
	module: {
		rules: [
			{
				test: /\.html$/i,
				use: ["html-loader"]
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					"postcss-loader",
					"sass-loader",
				],
			},
			{
				test: /\.pug$/i,
				exclude: /(node_modules|bower_components)/,
				use: [{
					loader: "html-loader"
				}, {
					loader: "pug-html-loader",
				}],
			},
			{
				test:/\.(jpg|png|svg|jpeg|gif)$/i,
				type: "asset/resource",
				generator: {
					filename: "assets/img/[name][ext]"
				}
			},
			{
				test:/\.(woff|woff2|eot|ttf|otf)$/i,
				type: "asset/resource",
				generator: {
					filename: "assets/fonts/[hash][ext]"
				}
			},
			{
				test: /\.js$/,
				exclude: /node-modules/,
				use: {
					loader: "babel-loader",
					options: {
						cacheDirectory: true,
					}
				},
				// generator: {
				// 	filename: "assets/js/[hash][ext]"
				// }
			}
		]
	}
}