'use strict'

const querystring = require('querystring')
const Teambition = require('teambition')

class Oauth {
  constructor (token, config = {}) {
    this.token = token
    this.protocol = config.protocol || 'https'
    this.host = config.host || 'api.teambition.com'
    this.authHost = config.authHost || 'account.teambition.com'
  }

  /**
   * auth url
   * @param clientId
   * @param redirectUri
   * @param state
   * @returns {string}
   */
  getAuthorizeUrl (clientId, redirectUri, state) {
    let qs = querystring.stringify({
      client_id: clientId,
      redirect_uri: redirectUri,
      state: state
    })
    return `${this.protocol}://${this.authHost}/oauth2/authorize?${qs}`
  }

  /**
   * access token url
   * @returns {string}
   */
  getAccessTokenUrl () {
    return `${this.protocol}://${this.authHost}/oauth2/access_token`
  }

  /**
   * auth middleware
   * @param clientId
   * @param clientSecret
   * @returns {function(*, *, *)}
   */
  authCallback (clientId, clientSecret) {
    let self = this
    let teambition = new Teambition()
    return (req, res, next) => {
      let code = req.query.code
      let api = self.getAccessTokenUrl()
      return teambition.post(api, {
        client_id: clientId,
        client_secret: clientSecret,
        code: code
      }, (err, body) => {
        if (err) throw err
        req.callbackBody = body
        return next()
      })
    }
  }

  /**
   * co generate auth middleware
   * @returns {function(*, *, *)}
   */
  authCoCallback (clientId, clientSecret) {
    let self = this
    let teambition = new Teambition()
    return function * (next) {
      let code = this.request.query.code
      let api = self.getAccessTokenUrl()
      yield teambition.post(api, {
        client_id: clientId,
        client_secret: clientSecret,
        code: code
      }, (err, body) => {
        if (err) throw err
        this.req.callbackBody = body
      })
      yield next
    }
  }
}

module.exports = Oauth
