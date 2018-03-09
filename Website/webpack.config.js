const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: [
        './src/index.jsx',
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    devtool: 'source-map',
    plugins: [
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, 'src')+'/index.html',
                to: 'index.html'
            }
        ])
    ],
    devServer: {
        contentBase: './build',
        historyApiFallback: true
    }
}
