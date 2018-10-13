const path = require('path');
const outdir = path.resolve(__dirname);

module.exports = {
    entry: [
        path.resolve('src/index.ts')
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: '357.js',
        path: outdir
    },
    mode: "development"
};