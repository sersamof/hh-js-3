const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const dist = path.resolve(__dirname, '../dist');
const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
module.exports = {
    entry: './src/index.js',
    mode: mode,
    output: {
        path: dist,
        filename: 'bundle.js',
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './static/index.html' }),
        new CopyWebpackPlugin([{ from: 'static', to: dist }]),
    ],
    watch: mode === 'production',
    devtool: 'eval',
    module: {
        rules: [
            {
                test: /\.(js)$/,
                include: path.resolve(__dirname, '../src'),
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/flow'],
                    },
                },
            },
        ],
    },
};
