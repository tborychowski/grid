module.exports = {
	debug: false,
	// devtool: '#source-map',
	output: {
		publicPath: './assets/',
		filename: 'app.js',
		sourceMapFilename: 'grid.js.map'
	},
	resolve: {
		root: __dirname,
		extensions: ['', '.js', '.json']
	},
	module: {
		loaders: [
			{ test: /\.html$/, loader: 'mustache' },
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader?experimental&comments=false'
			}
		]
	}
};
