'use strict'

const should = require('should')
const Oauth = require('../lib/index')
const oauth = new Oauth(null, {protocol: 'http', authHost: 'account.project.ci'})

let key = '665bb740-2b0f-11e7-ad12-67fd36012034'
let secret = '890668f2-a60e-4074-872b-16f16538e018'
let callback = 'http://localhost:10011/api/v1/connect/teambition/callback'

describe('Test Oauth', () => {
  it('should resolve get valid Url', (done) => {
    let authUrl = oauth.getAuthorizeUrl(key, callback, 'all')
    should.exist(authUrl)
    done()
  })

  it('should resolve get valid middleware', (done) => {
    let callback = oauth.authCallback(key, secret)
    should.exist(callback)
    done()
  })
})