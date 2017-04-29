'use strict'
const Oauth = require('../lib/index')
const express = require('express')
const app = express()
const oauth = new Oauth(null, {protocol: 'http', authHost: 'account.project.ci'})

let key = '665bb740-2b0f-11e7-ad12-67fd36012034'
let secret = '890668f2-a60e-4074-872b-16f16538e018'
let callback = 'http://localhost:10011/api/v1/connect/teambition/callback'

/**
 * 获取回调链接（同申请应用时候填写的应用一致）
 */
app.get('/', (req, res) => {
  let authUrl = oauth.getAuthorizeUrl(key, callback, 'all')
  res.redirect(authUrl)
})

/**
 * authCallback `${this.protocol}://${this.authHost}/oauth2/access_token`
 * 通过中间件调用Teambition，获取颁发的Access_Token
 */
app.get('/api/v1/connect/teambition/callback', oauth.authCallback(key, secret), (req, res) => {
  // todo 可存入session中，也可持久化存储
  res.send(req.callbackBody)
})

app.listen(10011)
