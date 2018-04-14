/**
 * postcss配置
 * @author barret
 * @data 2018/04/14
 * @type {{plugins: [*]}}
 */
module.exports = {
    plugins: [
        require('postcss-pxtorem')({
            rootValue: 100,
            propWhiteList: [],
            minPixelValue: 3,
        }),
        require('autoprefixer')
    ]
}