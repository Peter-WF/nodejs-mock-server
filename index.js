/**
 * @authors       Peter 王斐
 * @email         wangfeia@zbj.com
 * @date          2017-11-01 16:09
 * @description
 */

const server = require('./server')
const proxy = require('./proxy')

module.exports = {
  init({ app, appDir }) {
    MS.init({
      app,
      appDir
    })

    // server init
    server.init()
  }
}