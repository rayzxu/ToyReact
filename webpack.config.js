module.exports = {
    entry: './main.js',
    mode: 'development',
    optimization: {
        minimize: false
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: [[
                        "@babel/plugin-transform-react-jsx", // 处理jsx语法 // plugin的名字
                        {pragma: "ToyReact.createElement"} // plugin config
                    ]]
                }
            }
        }]
    }
};