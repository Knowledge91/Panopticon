const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                use: 'babel-loader',
                test: /\.js$/,
                exclude: /node_modules/
            }
        ]
    },
    devtool: 'source-map',
    plugins: [
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, 'src')+'/index.html',
                to: 'index.html'
            }
        ])
    ]
}
