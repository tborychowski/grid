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
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader?experimental&comments=false'
			}
		]
	}
};
