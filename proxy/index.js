/**
 * @authors       Peter 王斐
 * @email         wangfeia@zbj.com
 * @date          2017-11-02 09:54
 * @description
 */

'use strict';
const MS = require('./MS')

global.MS = new Proxy(new MS(), {
  get(target, propKey) {
    return target[propKey] != null ? target[propKey] : target._app[propKey]
  }
})
