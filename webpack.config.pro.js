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
    postcssConfig = require('./config/postcss.config.js'),
    theme = require('./config/config.theme.js'),
    defineConfig = require('./config/config.env.js'),
    UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin');

const definePluginOptionKey = process.env.NODE_ENV ? process.env.NODE_ENV:'test';
let defineContent = defineConfig[definePluginOptionKey];
defineContent['NODE_ENV']= definePluginOptionKey;

let entryConfig = {},
    plugins = [
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
                    collapse_vars: true, //内嵌定义了但是只用到一次的变量
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
        new webpack.HashedModuleIdsPlugin(),
        new CleanWebpackPlugin(['./output']),
    ];

pageConfig.map(info => {
    entryConfig[info.name] =  info.entry;
    plugins.push(
        new HtmlWebpackPlugin({
            template: info.template,
            title: info.title,
            filename: info.filename,
            chunks: [info.chunks],
            cache: true,
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true,
                html5: true,
                minifyCSS: true,
                minifyJS: true,
                minifyURLs: true,
                removeComments: true,
                removeEmptyAttributes: true,
                removeEmptyElements: true,
                removeOptionalTags: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true,
            }
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
    mode: 'production',
    // ant需要
    resolve: {
        modules: ['node_modules', path.join(__dirname, './node_modules')],
        extensions: ['.web.js', '.js', '.json'] // webpack2 不再需要一个空的字符串
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: ExtractTextWebpackPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {minimize: true}
                        },
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
                use: [
                    'style-loader',
                    'css-loader'
                ]
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
                use: ['url-loader?limit=8192&name=images/[hash:8].[name].[ext]']
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
    // 不需要打包的模块
    externals: {
        "react": 'React',
        "react-dom": "ReactDOM",
    },
    output: {
        path: path.resolve(__dirname, './output'),
        filename: "[name].[chunkhash:8].js",
        chunkFilename: "[id].[chunkhash:8].js",
        publicPath: '/'
    }
}