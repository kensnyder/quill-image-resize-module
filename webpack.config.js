var path = require('path');

module.exports = {
    entry: "./src/ImageResize.js",
    output: {
        path: path.join(__dirname, 'dist'),
        library: 'ImageResize',
        libraryTarget: 'umd',
        filename: "image-resize.min.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.join(__dirname, 'src'),
                exclude: /(node_modules)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        "presets": [["env", { "modules": false }]],
                        "plugins": ["babel-plugin-transform-class-properties"]
                    }
                }]
            },
            {
                test: /\.svg$/,
                use: [{
                    loader: 'raw-loader'
                }]
            }
        ]
    }
};
