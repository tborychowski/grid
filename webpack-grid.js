module.exports = {
	debug: false,
	output: {
		library: 'grid',
		libraryTarget: 'umd',
		filename: 'grid.js'
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
