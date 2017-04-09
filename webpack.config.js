const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        main: './client/src/main.ts',
        analytics: './client/src/analytics.js',
    },
    output: {
        filename: './client/target/[name].js'
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.ts$/,
                exclude: /(node_modules)/,
                loader: 'ts-loader',
            }
        ],
    },
    plugins: [
        new UglifyJSPlugin(),
    ],
}
