/**
 * webpack生产环境配置
 * @author barret
 * @data 2018/04/06
 */

const path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    webpack = require('webpack'),
    ExtractTextWebpackPlugin = require('extract-text-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    pageConfig = require('./config/config.page.js'),
    theme = require('./config/config.theme.js'),
    defineConfig = require('./config/config.env.js');

const definePluginOptionKey = process.env.NODE_ENV ? process.env.NODE_ENV:'test';
const defineContent = defineConfig[definePluginOptionKey];
defineContent['NODE_ENV']= definePluginOptionKey;

let entryConfig = {},
    plugins = [
        new CleanWebpackPlugin(['./output']),
        // 分开打包多个css
        new ExtractTextWebpackPlugin({
            filename: '[name].bundle.css',
            allChunks: true,
        }),
        new webpack.EnvironmentPlugin(defineContent)
    ];

pageConfig.list.map(info => {
    entryConfig[info.name] = info.entry;
    plugins.push(
        new HtmlWebpackPlugin({
            template: info.template,
            title: info.title,
            filename: info.filename
        })
    )
});

//配置多入口
module.exports = {
    context: path.resolve(__dirname, './src'),
    entry: {
        todoList: "./app/todo/index.js"
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.less$/,
                use: ExtractTextWebpackPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader', {loader: 'less-loader', options: {modifyVars: theme}}]
                })
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.js?$/,
                enforce: 'pre',
                use: [{
                    loader: 'eslint-loader',
                    options: { fix: true, cache: true}
                }],
                include: path.resolve(__dirname, './src/**/*.js'),
                exclude: /node_modules/
            },
            {
                test: /\.js?$/,
                use: [{
                    loader: 'babel-loader?cacheDirectory'
                }],
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                use: 'html'
            }
        ]
    },
    plugins: plugins,
    output: {
        path: path.resolve(__dirname, './output'),
        filename: "[name].js",
        chunkFilename: "[name].[id].[chunkhash:8].js",
        publicPath: '/'
    }
}