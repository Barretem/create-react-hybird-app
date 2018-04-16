/**
 * node 服务器配置
 * @author barret
 * @data 2018/04/14
 * @type {*}
 */
const Koa = require('koa'),
      router = require('koa-router')(),
      webpack = require('webpack'),
      webpackDevMiddleware = require('koa-webpack-dev-middleware'),
      webpackHotMiddleware = require("koa-webpack-hot-middleware"),
      opn = require('opn'),
      rp = require('request-promise'),
      app = new Koa(),
      config = require('../webpack.config.dev.js'),
      compiler = webpack(config),
      querystring = require('querystring');

// Tell koa to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackHotMiddleware(compiler, {
    log: false,
    heartbeat: 2000,
}));

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    index: 'todoIndex.html',
    hot: true,
}));

app.use(async (ctx, next) => {
    console.log(ctx.request.path+':'+ctx.request.method);
    await next();
});

/**
 * 处理本地登录
 */
router.get('/getUser', async(ctx,next)=> {
    // const options = {
    //     uri: '',
    // };
    // var req = await rp(options);

    ctx.response.body = {name: 'zhangsan', age: 18};

});
app.use(router.routes());

app.listen(3000, function () {
    console.log('app listening on port 3000!\n');
});

opn('http:127.0.0.1:3000');