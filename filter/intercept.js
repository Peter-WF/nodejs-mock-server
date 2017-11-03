/**
 * @authors       Peter 王斐
 * @email         wangfeia@zbj.com
 * @date          2017-11-02 10:18
 * @description
 */

'use strict';

const utils = require('../utils')

/**
 * 根据当前 cookie 中的 mockConfig 获取当前请求接口的 mockUrl
 */
function getMockUrl(req) {
  const apiMockStorage = JSON.parse(req.cookies.mockConfig || ' {}')
  const apiPath = req.baseUrl
  const method = req.method
  const mockType = apiMockStorage[`${apiPath}_${method}`]
  if (mockType) {
    return `/mock-server/api/${method}/${mockType}${apiPath}`
  } else if (apiPath.indexOf('/mock-server') !== 0 && req.cookies.globalAgent) {
    return `/mock-server/api/${method}/server${apiPath}`
  }
}

/**
 * 拦截 ServerResponse send 方法 && redirect 至 mock api
 */
function localMockIntercept(req, res, next) {
  // 判断当前请求接口是否需要 mock 数据
  const mockUrl = getMockUrl(req)
  if (mockUrl) {
    console.log(`[mock-server] redirect to '${mockUrl}' for mock data`.green);
    res.redirect(mockUrl)
    return
  }

  // 拦截 send 方法 用于数据缓存
  const originSend = res.send
  res.send = function(body) {
    // 仅仅缓存上次请求成功的数据，如果数据请求失败则保存上次的缓存
    if (typeof body === 'object' && body.success) {
      utils.saveData(utils.getCacheFileAbsolutePath(req.path, req.method, '.server'), body)
    }
    originSend.apply(this, arguments)
  }
  next()
}

module.exports = function(opt) {
  return localMockIntercept
}
