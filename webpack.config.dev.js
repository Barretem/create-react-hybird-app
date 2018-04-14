/**
 * webpack开发配置
 * @author barret
 * @data 2018/04/06
 */

const path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    webpack = require('webpack'),
    ExtractTextWebpackPlugin = require('extract-text-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    postcssConfig = require('./config/postcss.config.js'),
    pageConfig = require('./config/config.page.js'),
    theme = require('./config/config.theme.js'),
    defineConfig = require('./config/config.env.js'),
    CopyWebpackPlugin = require('copy-webpack-plugin');

const definePluginOptionKey = process.env.NODE_ENV ? process.env.NODE_ENV:'dev';
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
        new CopyWebpackPlugin([
            { from: './assets', to: './assets'},
        ]),
        new webpack.EnvironmentPlugin(defineContent),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ];

pageConfig.map(info => {
    entryConfig[info.name] = ['webpack-hot-middleware/client?reload=true', info.entry];
    plugins.push(
        new HtmlWebpackPlugin({
            template: info.template,
            title: info.title,
            filename: info.filename,
            cache: true,
        })
    )
});

//配置多入口
module.exports = {
    context: path.resolve(__dirname, './src'),
    entry: entryConfig,
    devtool: 'inline-source-map',
    mode: 'development',
    resolve: {
        modules: ['node_modules', path.join(__dirname, './node_modules')],
        extensions: ['.web.js', '.js', '.json'], // webpack2 不再需要一个空的字符串
        alias: {
            'react': 'react/umd/react.development.js',
            'react-dom': 'react-dom/umd/react-dom.development.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: ExtractTextWebpackPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: postcssConfig
                            }
                        },
                        {
                            loader: 'less-loader',
                            options: {modifyVars: theme}
                        }
                    ]
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
                include: path.resolve(__dirname, './src'),
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
        chunkFilename: "[id].[chunkhash:8].js",
        publicPath: '/'
    }
}