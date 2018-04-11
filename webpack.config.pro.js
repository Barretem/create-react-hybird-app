/**
 * webpack生产配置
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
    defineConfig = require('./config/config.env.js'),
    UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin');

const definePluginOptionKey = process.env.NODE_ENV ? process.env.NODE_ENV:'test';
const defineContent = defineConfig[definePluginOptionKey];
defineContent['NODE_ENV']= definePluginOptionKey;

let entryConfig = {},
    plugins = [
        new CleanWebpackPlugin(['./output']),
        // 分开打包多个css
        new ExtractTextWebpackPlugin({
            filename: '[name].[chunkhash:8].bundle.css',
            allChunks: true,
        }),
        new webpack.EnvironmentPlugin(defineContent),
        new  UglifyJsPlugin({
            test: /\.js$/i,
            cache: true, //启用文件缓存
            parallel: 4, //使用多进程并行运行来提高构建速度
            uglifyOptions: {
                ie8: false,
                ecma: 5, //支持的ECMAScript的版本
                compress: {
                    collapse_vars: true, //折叠单次使用非常量变量，副作用允许。
                    drop_console: false, //true为放弃对console.*的调用--这里为了快速定位生产问题，不去除console.*
                },
                output: {
                    beautify: false, //是否美化输出
                    comments: false, //不保留所有注释
                },
                toplevel: true //启用顶级变量和函数名称修改并删除未使用的变量和函数

            }
        }),
        new CopyWebpackPlugin([
            { from: './assets', to: './assets'},
        ]),
        new webpack.HashedModuleIdsPlugin()
    ];

pageConfig.map(info => {
    entryConfig[info.name] =  info.entry;
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
    entry: entryConfig,
    mode: 'production',
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
        filename: "[name].[chunkhash:8].js",
        chunkFilename: "[name].[id].[chunkhash:8].js",
        publicPath: '/'
    }
}