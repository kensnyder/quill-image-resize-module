var webpackConfig = require('./webpack.config')
var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || 9878
var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: '/',
  quiet: true
})


// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(require("webpack-hot-middleware")(compiler));

// serve pure static assets
app.use('/', express.static('./'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  opn(uri)
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
