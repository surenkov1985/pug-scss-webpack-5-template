const path = require("path");
const fs = require('fs')
const PAGES_DIR = path.join(__dirname, 'src/pug/pages/') ;
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'));

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const plugins = [
		new MiniCssExtractPlugin({
			filename: "assets/styles/[name].[contenthash].css"
		}),
		...PAGES.map(page => new HtmlWebpackPlugin({
			template: `${PAGES_DIR}/${page}`,
			filename: `./${page.replace(/\.pug/, '.html')}`,
		})),
		new CopyPlugin({
			patterns: [
				{from: "static", to: ""},

		]}),
	];

let mode = process.env.NODE_ENV === "production" ? "production" : "development";

const build = {
	mode: mode,
	context: path.resolve(__dirname, "./src"),
	mode: mode,

	plugins: plugins,
	entry: ["@babel/polyfill", "./index.js"],
	resolve: {
		alias: {
			"": path.resolve(__dirname, "src/")
		}
	},
	optimization: {
		splitChunks: {
			chunks: "all",
		},
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "assets/js/[name].[contenthash].js",
		// assetModuleFilename: "assets/[hash][ext][query]",
		clean: true
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
			}
		]
	}
}

const dev = {
	mode: mode,
	devtool: "source-map",
	devServer: {
		historyApiFallback: true,
		static: {
			directory: path.join(__dirname, "src"),
		},
		open: true,
		port: 8080,
		host: "local-ip",
		compress: true,
		hot: true,
		liveReload: true,
		client: {
			overlay: {
				warnings: true,
				errors: true
			}
		}
	},
}

if (mode === "production") {

	module.exports = Object.assign({}, build)
} else {

	module.exports = Object.assign(build, dev)
}

