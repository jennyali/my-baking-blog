var ExtractTextPlugin = require('extract-text-webpack-plugin');
var precss = require('precss');
var autoprefixer = require('autoprefixer');

module.exports = {
    entry: {
        index: ['./src/javascripts/index.js']
    },
    output: {
        path: './public',
        filename: '/javascripts/index.bundle.js'
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader!sass-loader")
            }
        ]
    },
    postcss: function() {
        return [autoprefixer, precss];
    },
    plugins: [
        new ExtractTextPlugin('stylesheets/main.css', {
            allChunks: true
        })
    ]
};