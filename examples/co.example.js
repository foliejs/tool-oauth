const Koa = require('koa')
const app = new Koa()
const Oauth = require('../lib/index')
const router = require('koa-router')()
const oauth = new Oauth(null, {protocol: 'http', authHost: 'account.project.ci'})

let key = '665bb740-2b0f-11e7-ad12-67fd36012034'
let secret = '890668f2-a60e-4074-872b-16f16538e018'
let callback = 'http://localhost:10011/api/v1/connect/teambition/callback'

// koa 1.0x co+generate
// x-response-time
app.use(function * (next) {
  // (1) 进入路由
  let start = new Date
  yield next
  // (5) 再次进入 x-response-time 中间件，记录2次通过此中间件「穿越」的时间
  let ms = new Date - start
  this.set('X-Response-Time', ms + 'ms')
  // (6) 返回 this.body
})

// koa 1.0x 路由
router
  // 获取回调链接（同申请应用时候填写的应用一致）
  .get('/', function * () {
    let authUrl = oauth.getAuthorizeUrl(key, callback, 'all')
    this.redirect(authUrl)
  })
  // 通过中间件调用Teambition，获取颁发的Access_Token
  .get('/api/v1/connect/teambition/callback', oauth.authCoCallback(key, secret), function * () {
    // todo 可存入session中，也可持久化存储
    this.body = this.request.callbackBody
  })

app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(10011, () => console.log(`co-app has listening on port 10011`))