const express = require('express'),
      webpack = require('webpack'),
      webpackDevMiddleware = require('webpack-dev-middleware'),
      webpackHotMiddleware = require("webpack-Hot-middleware"),
      opn = require('opn');

const app = express();
const config = require('../webpack.config.dev.js');
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
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

// Serve the files on port 3000.
app.listen(3000, function () {
    console.log('Example app listening on port 3000!\n');
});

opn('http:127.0.0.1:3000');