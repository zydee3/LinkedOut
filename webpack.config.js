const path = require('path');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        background: './scripts/background.js',
        content: './scripts/content.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    devtool: 'source-map',
    plugins: [
        new Dotenv(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'public/index.html', // Update with the path to your index.html
            chunks: ['content', 'background'] // Specify which bundles to include, e.g., 'content'
        }),
        new CopyPlugin({
            patterns: [
                { from: 'manifest.json', to: 'manifest.json' }
            ]
        }),
        new CopyPlugin({
            patterns: [
                { from: 'resources/icon.png', to: 'icon.png' }
            ]
        }),
    ],
    resolve: {
        fallback: {
            "module-not-needed": false
        }
    }
};