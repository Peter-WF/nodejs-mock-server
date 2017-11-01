/**
 * @authors       Peter 王斐
 * @email         wangfeia@zbj.com
 * @date          2017-11-01 16:09
 * @description
 */

const server = require('./server')

// 设置全局变量 mock-server => MS
const originMS = {}

module.exports = {
  init({ app, appDir }) {
    // mock server proxy
    global.MS = new Proxy(app, {
      get(target, propKey) {
        return originMS[propKey] != null ? originMS[propKey] : target[propKey]
      }
      // ,
      // set(target, propKey, value) {
      //   // 避免源示例对象
      //   originMS[propKey] = value
      // }
    })

    global.MS.appDir = appDir

    // server init
    server.init()
  }
}