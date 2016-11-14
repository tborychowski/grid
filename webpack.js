module.exports = {
	debug: false,
	// devtool: '#source-map',
	output: {
		publicPath: './assets/',
		filename: 'app.js',
		sourceMapFilename: 'lite-grid.js.map'
	},
	resolve: {
		root: __dirname,
		extensions: ['', '.js', '.json']
	},
	module: {
		loaders: [
			{ test: /\.html$/, loader: 'mustache' },
			{
				loader: 'babel-loader',
				test: /\.js$/,
				exclude: /node_modules/,
				query: { presets: ['es2015'] }
			}
		]
	}
};
