const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const event = process.env.npm_lifecycle_event;
const isProd = event === 'build';

const config = {
    mode: isProd ? 'production' : 'development',
    entry: './static/index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js'
    },
    plugins: [new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './static/index.html'
    })]
};

if (!isProd) {
    config.devServer = {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 8085
    };
}

module.exports = config;