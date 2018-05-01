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
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    serverConfig = require('./config/config.server.js'), // 引入dev-server配置文件
    proxyConfig = require('./config/config.proxy.js'); // 引入接口代理配置文件

const definePluginOptionKey = process.env.NODE_ENV ? process.env.NODE_ENV:'dev';
const defineContent = defineConfig[definePluginOptionKey];

let entryConfig = {},
    plugins = [
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
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(['./output']),
    ];

pageConfig.map(info => {
    entryConfig[info.name] = ['webpack-hot-middleware/client?reload=true', info.entry];
    plugins.push(
        new HtmlWebpackPlugin({
            template: info.template,
            title: info.title,
            filename: info.filename,
            chunks: [info.chunks],
            cache: true,
        })
    )
});

// ant  使用Icon需要
const svgDirs = [
    require.resolve('antd-mobile').replace(/warn\.js$/, ''), // 1. 属于 antd-mobile 内置 svg 文件
    // path.resolve(__dirname, 'src/my-project-svg-foler'),  // 2. 自己私人的 svg 存放目录
];


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
    // 配置服务器s
    devServer: {
        contentBase: path.resolve(__dirname, './src'), // New
        port: serverConfig.port,
        host: serverConfig.host,
        proxy: proxyConfig,
        historyApiFallback: true,
        compress: true,
        inline: false,
        hot: false,
        stats: {
            assets: true,
            children: false,
            chunks: false,
            hash: false,
            modules: false,
            publicPath: false,
            timings: true,
            version: false,
            warnings: true,
            colors: {
                green: '\u001b[32m',
            }
        },
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
                test: /\.(woff|woff2|eot|ttf)(\?.*$|$)/,
                use: ['url-loader']
            }, {
                test: /\.(svg)$/i,
                use: ['svg-sprite-loader'],
                include: svgDirs // 把 svgDirs 路径下的所有 svg 文件交给 svg-sprite-loader 插件处理
            }, {
                test: /\.(png|jpg)$/,
                use: ['url-loader']
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