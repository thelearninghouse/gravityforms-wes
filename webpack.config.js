const path = require("path");

module.exports = {
	entry: "./src/scripts/index.js",
	output: {
		path: path.resolve(__dirname, "public"),
		filename: "./js/tlh-gravity-forms-populate.min.js"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			}
		]
	}
};
